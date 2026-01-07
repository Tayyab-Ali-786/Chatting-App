const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);

const io = new Server(server, {
  path: "/ws/",       // changed: avoid default "/socket.io"
  cors: {
    origin: "*"
  }
});

app.get('/', (req, res) => {
  res.send("Hello World!")
});

io.on("connection", socket => {
  console.log("User connected");

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });


})

const PORT = process.env.PORT || 3002;

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the process using it or set PORT env var.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});

//testing the server