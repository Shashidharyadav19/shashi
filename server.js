const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let rooms = {}; // Stores room data: { roomName: [sockets] }

// Broadcast message to all clients in a specific room
function broadcast(room, data, senderSocket) {
    rooms[room].forEach((clientSocket) => {
        if (clientSocket !== senderSocket && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify(data));
        }
    });
}

server.on('connection', (socket) => {
    let currentRoom = null;
    let username = null;

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        // Handle user joining a room
        if (data.type === 'join') {
            currentRoom = data.room;
            username = data.username;

            // Add client to the room
            if (!rooms[currentRoom]) {
                rooms[currentRoom] = [];
            }
            rooms[currentRoom].push(socket);

            console.log(`${username} joined room: ${currentRoom}`);
            // Notify all clients in the room
            broadcast(currentRoom, {
                sender: 'System',
                message: `${username} has joined the room.`,
                timestamp: new Date().toLocaleTimeString()
            });
        }

        // Handle user sending a message
        if (data.type === 'message') {
            // Log the message to the console
            console.log(`${data.username} sent a message in ${currentRoom}: ${data.message}`);

            // Broadcast the message to everyone in the current room
            broadcast(currentRoom, {
                sender: data.username,
                message: data.message,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });

    socket.on('close', () => {
        // Remove the socket from the room
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom] = rooms[currentRoom].filter(s => s !== socket);
            console.log(`${username ? username : 'A user'} left room: ${currentRoom}`);
            
            // Notify all clients in the room
            broadcast(currentRoom, {
                sender: 'System',
                message: `${username ? username : 'A user'} has left the room.`,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });
});

console.log('WebSocket server running on ws://localhost:8080');
