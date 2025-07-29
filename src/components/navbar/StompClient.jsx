import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connect = (onNotificationReceived) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!token || !role || !username) {
    console.error("❌ Missing token, role, or username in localStorage");
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
      username: username,
    },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      // Role-based broadcast notifications
      stompClient.subscribe(`/topic/notifications/${role.toLowerCase()}`, (message) => {
        const notification = JSON.parse(message.body);
        console.log("📢 Broadcast notification:", notification);
        onNotificationReceived(notification);
      });

      // Private queue for engineers only
      if (role.toLowerCase() === "engineer") {
        stompClient.subscribe(`/user/queue/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          console.log("📩 Private engineer notification:", notification);
          onNotificationReceived(notification);
        });
      }
    },
    onStompError: (frame) => {
      console.error("STOMP Error:", frame.headers["message"]);
    },
    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log("🔌 Disconnected from WebSocket");
  }
};
