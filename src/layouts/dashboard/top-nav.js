import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import {
	Avatar,
	Badge,
	Box,
	IconButton,
	Stack,
	SvgIcon,
	Tooltip,
	useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "../../hooks/use-popover";
import { useAuth } from "../../hooks/use-auth";
import { getGreeting } from "../../utils/get-greeting";
import { getFirstName } from "../../utils/get-firstname";
import NotificationDropdown from "../../components/notifications-dropdown";
import { fetchUserMessages } from "../../services/api/message-chat.api";
import { AccountPopover } from "./account-popover";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
	const { onNavOpen } = props;
	const { user } = useAuth();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
	const accountPopover = usePopover();
	const notificationDropdown = usePopover();
	const [greeting, setGreeting] = useState(getGreeting());
	const [unreadCount, setUnreadCount] = useState("0");

	const getUnreadNotifications = useCallback(async () => {
		if (!user?._id) return;
		try {
			const response = await fetchUserMessages(user._id);
			const { data } = response;

			// Flatten and merge all messages
			const allMessages = data.flatMap((n) => n.messages || []);
			// Count unread messages where user_id matches logged-in user
			const count = allMessages.filter(
				(message) => !message.read && message.user_id === user._id,
			).length.toString();

			setUnreadCount(count);
		} catch (error) {
			console.error("Error fetching unread notifications:", error);
		}
	}, [user?._id]);

	useEffect(() => {
		setGreeting(getGreeting());
		getUnreadNotifications();
	}, [getUnreadNotifications]);

	return (
		<>
			<Box
				component="header"
				sx={{
					backdropFilter: "blur(6px)",
					backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
					position: "sticky",
					left: {
						lg: `${SIDE_NAV_WIDTH}px`,
					},
					top: 0,
					width: {
						lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
					},
					zIndex: (theme) => theme.zIndex.appBar,
				}}
			>
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					spacing={2}
					sx={{
						minHeight: TOP_NAV_HEIGHT,
						px: 2,
					}}
				>
					<Stack alignItems="center" direction="row" spacing={2}>
						{!lgUp && (
							<IconButton onClick={onNavOpen}>
								<SvgIcon fontSize="small">
									<Bars3Icon />
								</SvgIcon>
							</IconButton>
						)}
						{`${greeting}, ${getFirstName(user?.name)}`}
					</Stack>
					<Stack alignItems="center" direction="row" spacing={2}>
						<Tooltip 
							title={
								unreadCount === "0"
									? "No new message"
									: "You have new message, click to view"
							}
						>
							<IconButton
								ref={notificationDropdown.anchorRef}
								onClick={notificationDropdown.handleOpen}
							>
								<Badge badgeContent={unreadCount} color="success">
									<SvgIcon fontSize="small">
										<BellIcon />
									</SvgIcon>
								</Badge>
							</IconButton>
						</Tooltip>
						<Avatar
							onClick={accountPopover.handleOpen}
							ref={accountPopover.anchorRef}
							sx={{
								cursor: "pointer",
								height: 40,
								width: 40,
							}}
							src={user?.photoUrl || ""}
						/>
					</Stack>
				</Stack>
				<NotificationDropdown
					anchorEl={notificationDropdown.anchorRef.current}
					open={notificationDropdown.open}
					onClose={notificationDropdown.handleClose}
				/>
			</Box>
			<AccountPopover
				anchorEl={accountPopover.anchorRef.current}
				open={accountPopover.open}
				onClose={accountPopover.handleClose}
			/>
		</>
	);
};

TopNav.propTypes = {
	onNavOpen: PropTypes.func,
};
