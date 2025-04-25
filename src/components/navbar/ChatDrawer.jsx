
// import React, { useEffect, useState } from "react";
// import { connect, sendMessage, disconnect } from "./ChatSocket";
// import { Drawer, Input, Button, List } from "antd";
// import { SendOutlined } from "@ant-design/icons";

// const ChatDrawer = ({ open, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [to, setTo] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     connect((msg) => {
//       setMessages((prev) => [...prev, { ...msg, self: false }]);
//     });

//     return () => {
//       disconnect();
//     };
//   }, []);

//   const handleSend = () => {
//     if (to.trim() && message.trim()) {
//       const email = localStorage.getItem("email");
//       const newMsg = {
//         sender: email,
//         receiver: to,
//         content: message,
//         type: "CHAT",
//         self: true,
//       };

//       sendMessage(newMsg);
//       setMessages((prev) => [...prev, newMsg]);
//       setMessage("");
//     }
//   };

//   return (
//     <Drawer
//       title="Messages"
//       placement="right"
//       width={360}
//       onClose={onClose}
//       open={open}
//     >
//       <Input
//         placeholder="To"
//         value={to}
//         onChange={(e) => setTo(e.target.value)}
//         style={{ marginBottom: 8 }}
//       />
//       <List
//         size="small"
//         bordered
//         dataSource={messages}
//         renderItem={(msg) => (
//           <List.Item style={{ textAlign: msg.self ? "right" : "left" }}>
//             <strong>{msg.self ? "Me" : msg.sender}:</strong> {msg.content}
//           </List.Item>
//         )}
//         style={{ height: 300, overflowY: "scroll", marginBottom: 8 }}
//       />
//       <Input
//         placeholder="Type a message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onPressEnter={handleSend}
//         addonAfter={
//           <SendOutlined onClick={handleSend} style={{ cursor: "pointer" }} />
//         }
//       />
//     </Drawer>
//   );
// };

// export default ChatDrawer;

import React, { useEffect, useState } from "react";
import { connect, sendMessage, disconnect } from "./stompClient"; // Import stompClient functions
import { Drawer, Input, Button, List } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  // Set up WebSocket connection on component mount
  useEffect(() => {
    connect((msg) => {
      setMessages((prev) => [...prev, { ...msg, self: false }]); // Update messages with received data
    });

    return () => {
      disconnect(); // Clean up and disconnect when component unmounts
    };
  }, []);

  // Handle sending a message
  const handleSend = () => {
    if (to.trim() && message.trim()) {
      const email = localStorage.getItem("email"); // Get email from localStorage
      const newMsg = {
        sender: email,
        receiver: to,
        content: message,
        type: "CHAT",
        self: true, // Mark this as a self-sent message
      };

      sendMessage(newMsg); // Send the message to the server
      setMessages((prev) => [...prev, newMsg]); // Add the message to local state
      setMessage(""); // Clear the input field
    }
  };

  return (
    <Drawer
      title="Messages"
      placement="right"
      width={360}
      onClose={onClose}
      open={open}
    >
      <Input
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)} // Handle recipient input
        style={{ marginBottom: 8 }}
      />
      <List
        size="small"
        bordered
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item style={{ textAlign: msg.self ? "right" : "left" }}>
            <strong>{msg.self ? "Me" : msg.sender}:</strong> {msg.content}
          </List.Item>
        )}
        style={{ height: 300, overflowY: "scroll", marginBottom: 8 }}
      />
      <Input
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Handle message input
        onPressEnter={handleSend} // Send message when Enter is pressed
        addonAfter={
          <SendOutlined onClick={handleSend} style={{ cursor: "pointer" }} />
        }
      />
    </Drawer>
  );
};

export default ChatDrawer;
