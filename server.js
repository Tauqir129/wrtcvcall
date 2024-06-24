const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Socket.IO connection handler
io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    // Handle room/channel joining
    socket.on('join', room => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
        
        // Notify the client that they have successfully joined the room
        socket.emit('joined', room);
    });

    // Handle WebRTC signaling
    socket.on('signal', data => {
        io.to(data.room).emit('signal', data); // Broadcast the signal to everyone in the room
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
