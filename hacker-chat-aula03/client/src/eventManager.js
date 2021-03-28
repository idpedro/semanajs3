import { constants } from "./constants.js";

export default class EventManager {
  #allUsers = new Map();
  constructor({ componentEmitter, socketClient }) {
    this.componentEmitter = componentEmitter;
    this.socketClient = socketClient;
  }
  joinRoomAndWaitForMessages(data) {
    // send data to server
    this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data);

    // emmit event to GUI update
    this.componentEmitter.on(constants.events.app.MESSAGE_SENT, (msg) => {
      console.log("ok");
      this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg);
    });
  }

  updateUsers(users) {
    users.forEach(({ id, userName }) => {
      this.#allUsers.set(id, userName);
    });

    this.#updateUsersComponent(this.#allUsers);
  }

  newUserConnected(message) {
    const user = message;
    this.#allUsers.set(user.id, user.userName);
    // update online users
    this.#updateUsersComponent();
    // update activity log
    this.#updateActivityLogComponent(`${user.userName} joined!`);
  }
  #emitComponetUpdate(event, message) {
    this.componentEmitter.emit(event, message);
  }

  #updateActivityLogComponent(message) {
    this.#emitComponetUpdate(constants.events.app.ACTIVITYLOG_UPDATED, message);
  }
  #updateUsersComponent() {
    this.#emitComponetUpdate(
      constants.events.app.STATUS_UPDATED,
      Array.from(this.#allUsers.values())
    );
  }

  getEvents() {
    const functions = Reflect.ownKeys(EventManager.prototype)
      .filter((fn) => fn !== "constructor")
      .map((name) => [name, this[name].bind(this)]);
    return new Map(functions);
  }
}
