/**
node index.js\
 --username pedrofs\
 --room Sala01\
 --hostUri localhost
*/

import Events from "events";
import SocketClient from "./src/socket.js";
import CliConfig from "./src/cliConfig.js";
import TerminalController from "./src/terminalController.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componetEmitter = new Events();
const socketClient = new SocketClient(config);

await socketClient.initialize();

// const controller = new TerminalController();
// await controller.inicializeTable(componetEmitter);
