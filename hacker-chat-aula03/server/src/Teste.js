// async function testServer() {
//   // config client to host connection
//   const options = {
//     port: 9898,
//     host: "localhost",
//     headers: {
//       Connection: "Upgrade",
//       Upgrade: "websocket",
//     },
//   };

//   // load a http module
//   const http = await import("http");
//   // start the request
//   const req = http.request(options);
//   req.end();
//   // on request as upgrated http => websocket
//   req.on("upgrade", (resp, socket) => {
//     console.log("updated");
//     // listing [data]server => client
//     socket.on("data", (data) => {
//       console.log("client received", data.toString());
//     });
//     // send hello message to the server
//     setInterval(() => {
//       socket.write("Hello!");
//     }, 500);
//   });
// }

// // on user connect
// eventEmitter.on(constants.event.NEW_USER_CONNECTED, (socket) => {
//   console.log("new Connect as Arived!!!", socket.id);
//   // aweit data
//   socket.on("data", (data) => {
//     console.log("server received", data.toString());
//     // send data
//     socket.write("World!");
//   });
// });
// //start client connection
// await testServer();
