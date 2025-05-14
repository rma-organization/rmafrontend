import React, { useEffect, useState, useRef, useCallback } from "react";
import { Drawer, Input, Button, List, Avatar, Modal, Form, message as antMessage, Alert, Badge, Spin } from "antd";
import { SendOutlined, PlusOutlined, ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons";
import axios from "axios";
import { connect, sendMessage, disconnect } from "./StompClient";

const ChatDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [chatHistory, setChatHistory] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [errorMessage, setErrorMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const currentUser = localStorage.getItem("username") || "";

  // Initialize from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('chatUsers');
    const savedHistory = localStorage.getItem('chatHistory');
    const savedUnreadCounts = localStorage.getItem('unreadCounts');
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedHistory) setChatHistory(JSON.parse(savedHistory));
    if (savedUnreadCounts) setUnreadCounts(JSON.parse(savedUnreadCounts));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    localStorage.setItem('chatUsers', JSON.stringify(users));
    localStorage.setItem('unreadCounts', JSON.stringify(unreadCounts));
  }, [chatHistory, users, unreadCounts]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const focusMessageInput = useCallback(() => {
    messageInputRef.current?.focus();
  }, []);

  const markMessagesAsRead = useCallback((username) => {
    if (!username || !currentUser) return;
    
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[username];
      return newCounts;
    });
    
    axios.post('/api/chat/markAsRead', null, {
      params: { sender: username, receiver: currentUser }
    }).catch(err => {
      console.error("Failed to mark messages as read:", err);
    });
  }, [currentUser]);

  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get('/api/users', { timeout: 5000 });
      // Ensure response.data is an array before calling filter
      const usersData = Array.isArray(response.data) ? response.data : [];
      const usersList = usersData
        .filter(user => user?.username && user.username !== currentUser)
        .map(user => ({
          username: user.username,
          lastMessage: chatHistory[user.username]?.[chatHistory[user.username].length - 1]?.content || "",
          time: chatHistory[user.username]?.[chatHistory[user.username].length - 1]?.time || ""
        }));
      
      setUsers(prev => {
        const existingUsers = prev.filter(u => u?.username);
        const newUsers = usersList.filter(nu => 
          !existingUsers.some(eu => eu.username === nu.username)
        );
        return [...existingUsers, ...newUsers];
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      antMessage.error("Failed to load users. Using local data");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, chatHistory]);

  const loadChatHistory = useCallback(async (otherUser) => {
    if (!otherUser || !currentUser) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get('/api/chat/messages/between', {
        params: { sender: currentUser, receiver: otherUser }
      });
      
      const formattedMessages = response.data.map(msg => ({
        content: msg.content,
        sender: msg.sender,
        receiver: msg.receiver,
        type: msg.type,
        timestamp: msg.timestamp,
        time: msg.timestamp 
          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : "Now",
        self: msg.sender === currentUser
      }));

      setChatHistory(prev => ({
        ...prev,
        [otherUser]: formattedMessages
      }));

      if (otherUser === activeUser) {
        setMessages(formattedMessages);
      }

      if (formattedMessages.length > 0) {
        const lastMsg = formattedMessages[formattedMessages.length - 1];
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user?.username === otherUser 
              ? { 
                  ...user, 
                  lastMessage: lastMsg.content.substring(0, 30) + (lastMsg.content.length > 30 ? "..." : ""),
                  time: lastMsg.time
                } 
              : user
          ).filter(Boolean)
        );
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      antMessage.error(`Failed to load chat with ${otherUser}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, activeUser]);

  const handleIncomingMessage = useCallback((msg) => {
    if (!msg?.sender || !currentUser) return;
    
    const sender = msg.sender;
    const isCurrentChat = sender === activeUser;
    
    const newMsg = { 
      ...msg, 
      self: msg.sender === currentUser,
      time: msg.timestamp 
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "Now"
    };
    
    setChatHistory(prev => {
      const existingChat = prev[sender] || [];
      const messageExists = existingChat.some(m => m.timestamp === newMsg.timestamp);
      
      return {
        ...prev,
        [sender]: messageExists ? existingChat : [...existingChat, newMsg]
      };
    });

    if (isCurrentChat && open) {
      setMessages(prev => {
        const messageExists = prev.some(m => m.timestamp === newMsg.timestamp);
        return messageExists ? prev : [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 100);
    } else if (msg.receiver === currentUser) {
      setUnreadCounts(prev => ({
        ...prev,
        [sender]: (prev[sender] || 0) + 1
      }));
    }
    
    setUsers(prevUsers => {
      return prevUsers.map(user => 
        user?.username === sender 
          ? { 
              ...user, 
              lastMessage: newMsg.content.substring(0, 30) + (newMsg.content.length > 30 ? "..." : ""),
              time: "Just now"
            } 
          : user
      ).filter(Boolean);
    });
  }, [activeUser, currentUser, scrollToBottom, open]);

  useEffect(() => {
    if (!open || !currentUser) return;

    const setupWebSocket = async () => {
      setConnectionStatus('connecting');
      try {
        await connect(handleIncomingMessage, currentUser);
        setConnectionStatus('connected');
      } catch (error) {
        console.error("WebSocket connection error:", error);
        setConnectionStatus('disconnected');
        antMessage.error("Failed to connect to chat server");
      }
    };

    setupWebSocket();
    fetchUsers();

    return () => {
      disconnect();
      setConnectionStatus('disconnected');
    };
  }, [open, currentUser, fetchUsers, handleIncomingMessage]);

  useEffect(() => {
    if (!open || !currentUser) {
      setMessages([]);
      return;
    }

    if (activeUser) {
      setMessages([]);
      const userMessages = chatHistory[activeUser] || [];
      setMessages(userMessages);
      markMessagesAsRead(activeUser);
      
      if (userMessages.length === 0) {
        loadChatHistory(activeUser);
      }
      
      setTimeout(() => {
        scrollToBottom();
        focusMessageInput();
      }, 200);
    } else {
      setMessages([]);
    }
  }, [activeUser, chatHistory, loadChatHistory, scrollToBottom, focusMessageInput, markMessagesAsRead, open, currentUser]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, scrollToBottom, open]);

  const handleSend = async () => {
    if (!message.trim() || !activeUser || !currentUser) return;
    
    if (connectionStatus !== 'connected') {
      antMessage.error("Cannot send - not connected to server");
      return;
    }

    const newMsg = {
      sender: currentUser,
      receiver: activeUser,
      content: message,
      type: "CHAT",
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };

    try {
      setMessages(prev => [...prev, newMsg]);
      setChatHistory(prev => ({
        ...prev,
        [activeUser]: [...(prev[activeUser] || []), newMsg]
      }));
      
      setUsers(prev => 
        prev.map(user => 
          user?.username === activeUser 
            ? { 
                ...user, 
                lastMessage: newMsg.content.substring(0, 30) + (newMsg.content.length > 30 ? "..." : ""),
                time: "Just now"
              } 
            : user
        ).filter(Boolean)
      );
      
      setMessage("");
      sendMessage(newMsg);
      setTimeout(scrollToBottom, 100);
      focusMessageInput();
    } catch (error) {
      console.error("Send error:", error);
      antMessage.error("Failed to send message");
    }
  };

  const handleBackToUserList = () => {
    setActiveUser(null);
    setIsNewChat(false);
    setTo("");
    setMessages([]);
    focusMessageInput();
  };

  const selectUser = (user) => {
    if (!user?.username) {
      antMessage.error("Invalid user selected");
      return;
    }
    setActiveUser(user.username);
    setIsNewChat(false);
    markMessagesAsRead(user.username);
  };

  const handleNewChat = () => {
    setIsNewChat(true);
    setActiveUser(null);
    setMessages([]);
    focusMessageInput();
  };

  const handleAddUser = async () => {
    if (!newUsername.trim() || !currentUser) {
      antMessage.warning("Please enter a username");
      return;
    }

    if (newUsername.toLowerCase() === currentUser.toLowerCase()) {
      antMessage.warning("You cannot add yourself as a contact");
      return;
    }

    if (users.some(u => u?.username?.toLowerCase() === newUsername.toLowerCase())) {
      antMessage.warning(`${newUsername} is already in your contacts`);
      setNewUsername("");
      setIsAddUserModalVisible(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const response = await axios.get(`/api/users/${encodeURIComponent(newUsername.trim())}`);
      
      if (response.data) {
        const username = response.data.username || newUsername.trim();
        
        setUsers(prev => [
          ...prev.filter(u => u?.username),
          { username, lastMessage: "", time: "" }
        ]);
        
        setChatHistory(prev => ({
          ...prev,
          [username]: []
        }));
        
        setIsAddUserModalVisible(false);
        setNewUsername("");
        antMessage.success(`Added ${username} to contacts`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      let errorMsg = "Failed to add user";
      if (error.response?.status === 404) {
        errorMsg = `User "${newUsername}" not found`;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
      antMessage.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = (username) => {
    const trimmedUsername = username?.trim();
    if (!trimmedUsername) return;
    
    setMessages([]);
    setChatHistory(prev => ({
      ...prev,
      [trimmedUsername]: prev[trimmedUsername] || []
    }));
    
    setActiveUser(trimmedUsername);
    setIsNewChat(false);
    markMessagesAsRead(trimmedUsername);
    
    if (!users.some(u => u?.username?.toLowerCase() === trimmedUsername.toLowerCase())) {
      setUsers(prev => [...prev, { username: trimmedUsername, lastMessage: "", time: "" }]);
    }
  };

  const validUsers = users.filter(user => user?.username);

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {(activeUser || isNewChat) && (
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToUserList}
              style={{ marginRight: 8 }}
              aria-label="Back to contacts"
            />
          )}
          <span>{activeUser || (isNewChat ? "New Chat" : "Chats")}</span>
          <span style={{ 
            marginLeft: 'auto',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: connectionStatus === 'connected' ? '#52c41a' : 
                           connectionStatus === 'connecting' ? '#faad14' : '#f5222d'
          }} />
        </div>
      }
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      closable={false}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {connectionStatus !== 'connected' && (
        <Alert 
          message={
            connectionStatus === 'connecting' 
              ? "Connecting to chat server..." 
              : "Disconnected from server. Reconnecting..."
          }
          type={connectionStatus === 'connecting' ? 'warning' : 'error'}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {!activeUser && !isNewChat ? (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleNewChat}
            >
              New Chat
            </Button>
            <Button 
              icon={<UserAddOutlined />} 
              onClick={() => setIsAddUserModalVisible(true)}
            >
              Add Contact
            </Button>
          </div>
          <Spin spinning={isLoading}>
            <List
              itemLayout="horizontal"
              dataSource={validUsers}
              loading={isLoading}
              renderItem={(user) => (
                <List.Item 
                  onClick={() => selectUser(user)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: activeUser === user.username ? '#f0f0f0' : 'transparent',
                    padding: '12px 16px'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={unreadCounts[user.username] || 0} offset={[-5, 5]}>
                        <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                      </Badge>
                    }
                    title={user.username}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ 
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '70%',
                          fontWeight: unreadCounts[user.username] ? 'bold' : 'normal'
                        }}>
                          {user.lastMessage}
                        </span>
                        <span style={{ 
                          color: unreadCounts[user.username] ? '#1890ff' : '#999', 
                          fontSize: 12,
                          fontWeight: unreadCounts[user.username] ? 'bold' : 'normal'
                        }}>
                          {user.time}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Spin>
        </div>
      ) : isNewChat ? (
        <div style={{ flex: 1, padding: 16 }}>
          <Input
            placeholder="Enter username to chat with"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onPressEnter={() => to.trim() && startNewConversation(to)}
            autoFocus
          />
          <div style={{ marginTop: 16 }}>
            <h4>Recent Contacts</h4>
            <List
              dataSource={validUsers.slice(0, 5)}
              renderItem={(user) => (
                <List.Item 
                  onClick={() => selectUser(user)}
                  style={{ cursor: 'pointer', padding: '8px 0' }}
                >
                  <Badge count={unreadCounts[user.username] || 0} offset={[-5, 5]}>
                    <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                  </Badge>
                  <span style={{ 
                    marginLeft: 8,
                    fontWeight: unreadCounts[user.username] ? 'bold' : 'normal'
                  }}>
                    {user.username}
                  </span>
                </List.Item>
              )}
            />
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ 
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToUserList}
              style={{ marginRight: 12 }}
            />
            <div style={{ 
              flex: 1, 
              textAlign: 'center', 
              fontWeight: '500',
              fontSize: '16px'
            }}>
              {activeUser}
            </div>
            <div style={{ width: 46 }} />
          </div>
          
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px',
            marginTop: 0
          }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div 
                  key={`${msg.timestamp}-${index}`}
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.self ? 'flex-end' : 'flex-start',
                    margin: '12px 0'
                  }}
                >
                  <div 
                    style={{ 
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: 18,
                      background: msg.self ? '#1890ff' : '#f0f0f0',
                      color: msg.self ? 'white' : 'black',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.content}
                  </div>
                  <span style={{ 
                    fontSize: 12,
                    color: '#999',
                    marginTop: 4,
                    alignSelf: msg.self ? 'flex-end' : 'flex-start'
                  }}>
                    {msg.time}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                color: '#999'
              }}>
                {isLoading ? <Spin /> : "No messages yet"}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ 
            padding: '12px 16px', 
            borderTop: '1px solid #f0f0f0', 
            background: 'white',
            display: 'flex',
            gap: 8
          }}>
            <Input.TextArea
              ref={messageInputRef}
              placeholder={connectionStatus === 'connected' ? "Type a message..." : "Connecting..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ borderRadius: 20, resize: 'none', flex: 1 }}
              disabled={connectionStatus !== 'connected'}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!message.trim() || connectionStatus !== 'connected'}
              style={{ 
                alignSelf: 'flex-end', 
                backgroundColor: '#1890ff',
                width: 40,
                height: 40
              }}
            />
          </div>
        </div>
      )}

      <Modal
        title="Add New Contact"
        open={isAddUserModalVisible}
        onOk={handleAddUser}
        onCancel={() => {
          setIsAddUserModalVisible(false);
          setNewUsername("");
          setErrorMessage('');
        }}
        confirmLoading={isLoading}
        okButtonProps={{ disabled: !newUsername.trim() }}
      >
        <Form layout="vertical">
          <Form.Item label="Username" required>
            <Input 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              onPressEnter={handleAddUser}
              autoFocus
              placeholder="Enter exact username"
            />
          </Form.Item>
          {errorMessage && (
            <Alert 
              message={errorMessage} 
              type="error" 
              showIcon 
              style={{ marginBottom: 16 }} 
            />
          )}
        </Form>
      </Modal>
    </Drawer>
  );
};

export default ChatDrawer;