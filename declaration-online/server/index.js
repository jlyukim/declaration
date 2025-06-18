const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { join } = require('node:path');
const cors = require('cors');

const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
})

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});