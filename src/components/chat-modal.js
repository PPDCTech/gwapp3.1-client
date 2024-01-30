import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  TextField,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import XCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import axios from "axios";
import { MESSAGES_URL, USERS_URL } from "src/services/constants";
import { toast } from "react-toastify";
import { fetchData } from "src/services/helpers";
import { useAuth } from "src/hooks/use-auth";
import { addMessage, fetchMessages } from "src/services/api";

function ChatModal({ open, onClose, reqId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(true);

  const auth = useAuth();

  const user = auth?.user;
  const userId = user?._id || "";
  const lastMessageRef = useRef(null);

  const messageStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "rgba(255, 255, 255, 0.9)",
    boxShadow: 24,
    p: 2,
    borderRadius: "10px",
    width: "80%",
    maxWidth: "500px",
    fontSize: "16px",
    "@media (max-width: 600px)": {
      width: "90%",
      maxWidth: "100%",
      fontSize: "14px",
    },
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (reqId) {
          setLoadingMessages(true);
          const messages = await fetchMessages(reqId);
          setMessages(messages);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [reqId, setLoadingMessages]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = {};
      for (const message of messages) {
        if (!usersData[message.user_id]) {
          const userData = await fetchData(`${USERS_URL}/${message.user_id}`);
          usersData[message.user_id] = userData;
        }
      }
      setUsers(usersData);
    };

    fetchUsers();
  }, [messages]);

  useEffect(() => {
    if (open && lastMessageRef.current && !loading) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages, loading]);

  const sendMessage = async () => {
    try {
      setLoading(true);
      const addedMessage = await addMessage(reqId, auth?.user._id, message);
      console.log("Added Message:", addedMessage);
      const updatedMessages = await fetchMessages(reqId);
      setMessages(updatedMessages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setMessage("");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="chat-modal-title"
      aria-describedby="chat-modal-description"
    >
      <Box sx={messageStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" className="text-item-header">
            Messages
          </Typography>
          <Button onClick={onClose} color="error">
            <XCircleIcon />
          </Button>
        </Box>
        <List
          sx={{
            overflowY: "auto",
            maxHeight: "200px",
            "@media (max-width: 600px)": { maxHeight: "150px" },
          }}
        >
          {loadingMessages ? (
            <Typography variant="subtitle1">Loading...</Typography>
          ) : messages.length === 0 ? (
            <Typography variant="subtitle1">No Messages</Typography>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.user_id === userId;
              const user = users[message.user_id] || {};

              const isLastMessage = index === messages.length - 1 ? lastMessageRef : null;

              return (
                <ListItem
                  ref={isLastMessage ? lastMessageRef : null}
                  key={index}
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#F2F2F2" : "#FFFFFF",
                  }}
                >
                  <ListItemAvatar sx={{ width: 32, height: 32 }}>
                    <Avatar alt={user.name} src={user.photoUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={isOwnMessage ? "You" : user.name}
                    secondary={message.message}
                  />
                </ListItem>
              );
            })
          )}
        </List>
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <TextField
            id="outlined-basic"
            label="New Message"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mr: 1 }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <Button className="btn-type-info btn-md" onClick={sendMessage}>
            {loading ? "..." : <PaperAirplaneIcon className="h-6 w-6 text-gray-500" />}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ChatModal;
