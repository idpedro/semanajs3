import Events from "events";

export default class SocketClient {
  #serverConnection;
  #serverListenner = new Events();

  constructor({ host, port, protocol }) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  async sendMessage(event, message) {
    this.#serverConnection.write(JSON.stringify({ event, message }));
  }
  attachEvents(events) {
    this.#serverConnection.on("data", (data) => {
      try {
        data
          .toString()
          .split("\n")
          .filter((line) => !!line)
          .map(JSON.parse)
          .map(({ event, message }) => {
            this.#serverListenner.emit(event, message);
          });
      } catch (error) {
        console.log("invalid!", data.toString());
      }
    });

    this.#serverConnection.on("end", () => {
      console.log("I disconnected!!");
    });
    this.#serverConnection.on("error", (error) => {
      console.log("deu ruim!!", error);
    });

    for (const [key, value] of events) {
      this.#serverListenner.on(key, value);
    }
  }

  async createConnecton() {
    // config client to host connection
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
      },
    };

    const http = await import(this.protocol);
    const req = http.request(options);
    req.end();

    return new Promise((resolve) => {
      req.once("upgrade", (resp, socket) => {
        resolve(socket);
      });
    });
  }
  async initialize() {
    this.#serverConnection = await this.createConnecton();
    console.log("I connected to the server!!");
  }
}
