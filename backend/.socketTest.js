// socketTest.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  reconnectionAttempts: 3,
});

// Log when connected
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // send a test message
  socket.emit("chat_message", {
    message: "Hello server! This is a test message.",
    sender: "JobSeeker",
  });
});

// Receive messages
socket.on("chat_message", (data) => {
  console.log("📩 Received message:", data);
});

// Handle disconnection
socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});
