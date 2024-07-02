import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	Popover,
	ListItem,
	ListItemText,
	Typography,
	Box,
	Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	fetchUserMessages,
	markMessageAsRead,
} from "../services/api/message-chat.api";
import { useAuth } from "../hooks/use-auth";
import { success } from "../theme/colors";

const NotificationDropdown = (props) => {
	const { anchorEl, open, onClose } = props;
	const { user } = useAuth();
	const [userNotifications, setUserNotifications] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const getUserMessages = async () => {
			const response = await fetchUserMessages(user?._id);
			const data = response.data;

			const allMessages = data.flatMap((notification) =>
				notification.messages.map((message) => ({
					...message,
					notificationId: notification._id,
					requisitionId: notification.requisition_id,
					createdAt: notification.createdAt,
				})),
			);

			const userMessages = allMessages.filter(
				(message) => message.user_id === user?._id,
			);
			setUserNotifications(userMessages);
		};

		getUserMessages();
	}, [user?._id]);

	const formatTimeDifference = (timestamp) => {
		const currentTime = new Date();
		const messageTime = new Date(timestamp);
		const timeDifference = Math.abs(
			currentTime.getTime() - messageTime.getTime(),
		);

		const minuteInMilliseconds = 60 * 1000;
		const hourInMilliseconds = 60 * minuteInMilliseconds;
		const dayInMilliseconds = 24 * hourInMilliseconds;

		if (timeDifference < minuteInMilliseconds) {
			return "Less than a minute ago";
		} else if (timeDifference < hourInMilliseconds) {
			const minutes = Math.floor(timeDifference / minuteInMilliseconds);
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else if (timeDifference < dayInMilliseconds) {
			const hours = Math.floor(timeDifference / hourInMilliseconds);
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else {
			const days = Math.floor(timeDifference / dayInMilliseconds);
			return `${days} day${days > 1 ? "s" : ""} ago`;
		}
	};

	const handleReadClick = async (messageId, requisitionId) => {
		await markMessageAsRead(user?._id, messageId);
		navigate(
			`/requisitions?id=${requisitionId}&action=openModal&selectedTab=allRequisitions`,
		);

		const updatedNotifications = userNotifications.map((message) => {
			if (message._id === messageId) {
				return { ...message, read: true };
			}
			return message;
		});
		setUserNotifications(updatedNotifications);
	};

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					maxHeight: 400,
					overflowY: "auto",
				},
			}}
		>
			<Box
				p={2}
				sx={{ width: "18vw", "@media (max-width: 600px)": { width: "60vw" } }}
			>
				<Typography variant="subtitle1" gutterBottom>
					Notifications
				</Typography>
				{userNotifications.map((message) => (
					<Tooltip
						title="Click to view item"
						key={message._id}
						placement="top-start"
					>
						<ListItem
							key={message._id}
							onClick={() => handleReadClick(message._id, message.requisitionId)}
							style={{
								cursor: "pointer",
								backgroundColor: `${message.read ? "transparent" : success.lightest}`,
								borderBottom: "0.1px solid #aaa",
							}}
						>
							<ListItemText
								sx={{ margin: 0, padding: 0 }}
								primary={<Typography variant="body2">{message.message}</Typography>}
								secondary={
									<Typography variant="caption">
										{formatTimeDifference(message.createdAt)}
									</Typography>
								}
							/>
						</ListItem>
					</Tooltip>
				))}
				{userNotifications.length === 0 && (
					<Typography variant="body2" color="textSecondary">
						No new notifications.
					</Typography>
				)}
			</Box>
		</Popover>
	);
};

NotificationDropdown.propTypes = {
	anchorEl: PropTypes.any,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default NotificationDropdown;
