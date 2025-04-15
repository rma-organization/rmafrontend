import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { connect, sendMessage, disconnect } from "./ChatSocket";

const ChatDrawer = ({ open, onClose }) => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (open) {
      connect(handleIncomingMessage);
    }
    return () => disconnect();
  }, [open]);

  const handleIncomingMessage = (data) => {
    setMessages((prev) => [...prev, { ...data, self: false }]);
  };

  const handleSend = () => {
    if (to.trim() && message.trim()) {
      const newMsg = { to, content: message };
      sendMessage(newMsg);
      setMessages((prev) => [...prev, { ...newMsg, self: true }]);
      setMessage("");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, padding: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Message List */}
        <List sx={{ flexGrow: 1, overflowY: "auto", my: 2 }}>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ textAlign: msg.self ? "right" : "left" }}>
              <ListItemText
                primary={msg.content}
                secondary={msg.self ? "You" : msg.to}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItem>
          ))}
        </List>

        {/* Form */}
        <TextField
          label="To (email)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" fullWidth onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;