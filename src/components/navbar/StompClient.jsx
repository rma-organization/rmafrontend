import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connect = (onMessageReceived) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  console.log("Connecting as:", username);

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    connectHeaders: {
      Authorization: `Bearer ${token}`,  
    },
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      // Subscribe to private user queue (Spring sends user-specific messages here)
      stompClient.subscribe("/user/queue/messages", (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      });

      // Notify server that user connected
      stompClient.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ sender: username }),
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },

    onWebSocketClose: (event) => {
      console.log("WebSocket closed:", event);
    },

    onWebSocketError: (event) => {
      console.error("WebSocket error:", event);
    },
  });

  stompClient.activate();
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
  } else {
    console.error("❌ Cannot send message. STOMP client not connected.");
  }
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("Disconnected from WebSocket");
  }
};
