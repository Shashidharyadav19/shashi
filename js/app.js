let socket;
let currentRoom = null;

// Connect to WebSocket server
function connectWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        displayMessage(data.sender, data.message, data.timestamp);
    };

    socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };
}

// Join a room
function joinRoom(roomName, username) {
    currentRoom = roomName;

    // Send a "join" message to the server
    const joinData = {
        type: 'join',
        room: roomName,
        username: username
    };
    socket.send(JSON.stringify(joinData));

    alert(`Joined room: ${roomName}`);
}

// Send a message to the WebSocket server
function sendMessage() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    if (username && message && currentRoom) {
        const data = {
            type: 'message',
            room: currentRoom,
            username: username,
            message: message
        };
        console.log("Sending message: ", data); 
        socket.send(JSON.stringify(data));
        document.getElementById('message').value = ''; // Clear message input
    } else {
        alert('Please enter a username, message, and join a room.');
    }
}

// Display the message in the chat box
function displayMessage(sender, message, timestamp) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}</strong> (${timestamp}): ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

// Create and join a room
function createRoom() {
    const roomName = document.getElementById('roomName').value;
    const username = document.getElementById('username').value;

    if (roomName && username) {
        joinRoom(roomName, username);
        document.getElementById('roomName').value = ''; // Clear input
    } else {
        alert('Please enter a room name and your username.');
    }
}

// Initialize WebSocket connection
window.onload = connectWebSocket;
