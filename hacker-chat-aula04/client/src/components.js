import blessed from "blessed";

export default class ComponentsBuilder {
  #screen;
  #layout;
  #input;
  #chat;
  #status;
  #activityLog;

  constructor() {}
  #baseComponent() {
    return {
      border: "line",
      mouse: true,
      top: 0,
      scrollbars: {
        ch: "",
        inverse: true,
      },
      // Permite colocar cores e tags antes dos textos
      tags: true,
    };
  }

  setScreen({ title }) {
    this.#screen = blessed.screen({
      // Ativa o redimecionamento automatico
      smartCSR: true,
      title,
    });

    this.#screen.key(["escape", "q", "C-c"], () => {
      process.exit(0);
    });

    // seguindo o padrão build retornando o this
    return this;
  }

  setLayoutComponent() {
    // cria o container
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: "100%",
      height: "100%",
    });
    return this;
  }

  setInputComponent(onEnterPress) {
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      height: "10%",
      inputOnFocus: true,
      padding: {
        top: 1,
        left: 2,
      },
      style: {
        fg: "#f6f6f6",
        bg: "#353535",
      },
    });

    // passa um callback para ser executado ao pressionar a telca enter
    input.key("enter", onEnterPress);
    this.#input = input;

    return this;
  }
  setChatComponent() {
    this.#chat = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      align: "left",
      width: "50%",
      height: "90%",
      scrollable: true,
      items: ["{bold}Message{/}"],
    });
    return this;
  }
  setStatusComponent() {
    this.#status = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: "25%",
      height: "90%",
      items: ["{bold}Users On Room{/}"],
    });
    return this;
  }
  setActivityLogComponent() {
    this.#activityLog = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: "25%",
      height: "90%",
      style: {
        fg: "yellow",
      },
      items: ["{bold}Activity Log{/}"],
    });
    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      input: this.#input,
      chat: this.#chat,
      status: this.#status,
      activityLog: this.#activityLog,
    };

    return components;
  }
}
