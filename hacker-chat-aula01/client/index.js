import Events from "events";
import TerminalController from "./src/terminalController.js";

const componetEmitter = new Events();
const controller = new TerminalController();

await controller.inicializeTable(componetEmitter);
