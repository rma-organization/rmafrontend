// import { Client } from "@stomp/stompjs";

// let stompClient = null;

// export const connect = (onMessageReceived) => {
//   stompClient = new Client({
//     brokerURL: "ws://localhost:8080/ws",
//     reconnectDelay: 5000,
//     onConnect: () => {
//       console.log("✅ Connected to WebSocket");
//       const email = localStorage.getItem("email");

//       stompClient.subscribe("/user/queue/messages", (message) => {
//         const data = JSON.parse(message.body);
//         onMessageReceived(data);
//       });

//       stompClient.publish({
//         destination: "/app/chat.addUser",
//         body: JSON.stringify({ sender: email })
//       });
//     },
//     onStompError: (frame) => {
//       console.error("❌ STOMP error:", frame);
//     }
//   });

//   stompClient.activate();
// };

// export const sendMessage = (message) => {
//   if (stompClient && stompClient.connected) {
//     stompClient.publish({
//       destination: "/app/chat.sendMessage",
//       body: JSON.stringify(message)
//     });
//   } else {
//     console.error("❌ Cannot send message. STOMP client not connected.");
//   }
// };

// export const disconnect = () => {
//   if (stompClient) stompClient.deactivate();
// };


import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connect = (onMessageReceived) => {
  const email = localStorage.getItem("email");

  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {
      email: email, // ✅ Pass email in CONNECT headers
    },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      stompClient.subscribe("/user/queue/messages", (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      });

      stompClient.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ sender: email }),
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
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
  if (stompClient) stompClient.deactivate();
};
