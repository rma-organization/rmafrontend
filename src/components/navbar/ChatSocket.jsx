// chatSocket.jsx

let socket = null;
let messageCallback = null;

/**
 * Connects to the WebSocket server and sets up event handlers.
 * @param {Function} onMessageReceived - Callback for when a message is received.
 * @param {Function} [onOpenCallback=null] - Optional callback when socket opens.
 */
export const connect = (onMessageReceived, onOpenCallback = null) => {
  socket = new WebSocket("ws://localhost:8080/chat"); // Adjust your endpoint if needed

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
    if (onOpenCallback) onOpenCallback();
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (messageCallback) messageCallback(data);
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket disconnected");
  };

  messageCallback = onMessageReceived;
};

/**
 * Sends a message through the WebSocket connection.
 * @param {Object} msgObj - Message object to send.
 */
export const sendMessage = (msgObj) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msgObj));
  } else {
    console.warn("⚠️ WebSocket not open. Cannot send message.");
  }
};

/**
 * Disconnects the WebSocket connection.
 */
export const disconnect = () => {
  if (socket) {
    socket.close();
  }
};
