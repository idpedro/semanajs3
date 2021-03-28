import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
  #usersColors = new Map();

  constructor() {}
  #pickColor() {
    return `#${(((1 << 24) * Math.random()) | 0).toString(16)}-fg`;
  }

  #getUserColor(userName) {
    if (this.#usersColors.has(userName)) return this.#usersColors.get(userName);

    const collor = this.#pickColor();
    this.#usersColors.set(userName, collor);

    return collor;
  }

  #onInputReviced(eventEmmiter) {
    return function () {
      const message = this.getValue();
      eventEmmiter.emit(constants.events.app.MESSAGE_SENT, message);
      this.clearValue();
    };
  }
  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const collor = this.#getUserColor(userName);
      chat.addItem(`{${collor}}{bold}${userName}{/}:${message}`);
      screen.render();
    };
  }

  #onLogChanged({ screen, activityLog }) {
    return (msg) => {
      const [userName] = msg.split(/\s/);
      const collor = this.#getUserColor(userName);
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`);
      screen.render();
    };
  }

  #onStatusChanged({ screen, status }) {
    return (users) => {
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);
      users.forEach((userName) => {
        const collor = this.#getUserColor(userName);
        status.addItem(`{${collor}}{bold}${userName}{/}`);
        screen.render();
      });
    };
  }

  #registerEvents(eventEmmiter, components) {
    eventEmmiter.on(
      constants.events.app.MESSAGE_RECEIVED,
      this.#onMessageReceived(components)
    );
    eventEmmiter.on(
      constants.events.app.ACTIVITYLOG_UPDATED,
      this.#onLogChanged(components)
    );
    eventEmmiter.on(
      constants.events.app.STATUS_UPDATED,
      this.#onStatusChanged(components)
    );
  }

  async inicializeTable(eventEmmiter) {
    const components = new ComponentsBuilder()
      .setScreen({
        title: "HackerChat - Pedro Ferreira",
      })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReviced(eventEmmiter))
      .setChatComponent()
      .setStatusComponent()
      .setActivityLogComponent()
      .build();

    this.#registerEvents(eventEmmiter, components);
    components.input.focus();
    components.screen.render();
  }
}
