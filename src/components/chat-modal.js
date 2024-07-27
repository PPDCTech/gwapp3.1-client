import { useEffect, useRef, useState } from "react";
import {
	Modal,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	Box,
	TextField,
	ListItemAvatar,
	Avatar,
	Badge,
	Tooltip,
} from "@mui/material";
import XCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import { toast } from "react-toastify";
import { fetchSingleUser } from "../services/api/users.api";
import { addMessage, fetchMessages } from "../services/api/message-chat.api";
import { useAuth } from "../hooks/use-auth";

function ChatModal({ open, onClose, reqId }) {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState({});
	const [loadingMessages, setLoadingMessages] = useState(true);

	const { user } = useAuth();
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
					const response = await fetchMessages(reqId);
					setMessages(response.data);
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
			if (userId) {
				const usersData = {};
				for (const message of messages) {
					if (!usersData[message.user_id]) {
						const userData = await fetchSingleUser(message.user_id);
						usersData[message.user_id] = userData;
					}
				}
				setUsers(usersData);
			}
		};

		fetchUsers();
	}, [messages, userId]);

	useEffect(() => {
		if (open && lastMessageRef.current && !loading) {
			lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [open, messages, loading]);

	const sendMessage = async () => {
		try {
			setLoading(true);
			await addMessage(reqId, user._id, message);
			const updatedMessages = await fetchMessages(reqId);
			setMessages(updatedMessages.data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
			setMessage("");
		}
	};

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
						messages &&
						messages.map((message, index) => {
							const isOwnMessage = message.user_id === userId;
							const sender = !isOwnMessage ? users[message.user_id] : {};

							const isLastMessage =
								index === messages.length - 1 ? lastMessageRef : null;

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
										<Avatar
											alt={isOwnMessage ? user?.name : sender?.data.name || ""}
											src={isOwnMessage ? user?.photoUrl : sender?.data.photoUrl || ""}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={isOwnMessage ? "You" : sender?.data.name || "..."}
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
						{loading ? (
							"..."
						) : (
							<PaperAirplaneIcon className="h-6 w-6 text-gray-500" />
						)}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}

export default ChatModal;
