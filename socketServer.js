const http = require("http");
const socketIo = require("socket.io");
const handleSocket = require("./sockets/tracking");
const app = require("./server");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

handleSocket(io);

server.listen(process.env.PORT, () =>
  console.log(`Server with socket listening on port ${process.env.PORT}`)
);
