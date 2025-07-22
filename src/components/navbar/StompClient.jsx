import { Client } from "@stomp/stompjs";

// Initialize the STOMP client
let stompClient = null;

// Connect to the WebSocket and subscribe to the user's message queue
export const connect = (onMessageReceived) => {
  const username = localStorage.getItem("username"); // Retrieve user email from localStorage
  console.log("📧 Username from localStorage:", username);

  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws", // Your WebSocket endpoint
    connectHeaders: {
      username: username, // Pass email in headers for connection
    },
    reconnectDelay: 5000, // Reconnect delay in case of disconnection

    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      // Subscribe to receive messages for this user
      stompClient.subscribe("/user/queue/messages", (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data); // Call the callback function when a new message is received
      });

      // Inform the server that the user has connected
      stompClient.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ sender: username }),
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },
  });

  stompClient.activate(); // Establish the WebSocket connection
};

// Send a message to the WebSocket server
export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message), // Send message as JSON
    });
  } else {
    console.error("❌ Cannot send message. STOMP client not connected.");
  }
};

// Disconnect from the WebSocket
export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate(); // Close the WebSocket connection
  }
};
