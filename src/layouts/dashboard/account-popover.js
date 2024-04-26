import { useCallback } from "react";
import PropTypes from "prop-types";
import {
	Box,
	Divider,
	MenuItem,
	MenuList,
	Popover,
	Typography,
} from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";

export const AccountPopover = (props) => {
	const { anchorEl, onClose, open } = props;
	const navigate = useNavigate
	const auth = useAuth();

	const handleSignOut = useCallback(() => {
		onClose?.();
		auth.signOut();
		navigate("/user/login");
	}, [onClose, auth, navigate]);

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{
				horizontal: "left",
				vertical: "bottom",
			}}
			onClose={onClose}
			open={open}
			PaperProps={{ sx: { width: 200 } }}
		>
			<Box
				sx={{
					py: 1.5,
					px: 2,
				}}
			>
				<Typography variant="overline">Account</Typography>
				<Typography color="text.secondary" variant="body2">
					{auth.user?.name}
				</Typography>
				<Typography color="text.secondary" variant="body2">
					<b>{auth.user?.email}</b>
				</Typography>
			</Box>
			<Divider />
			<MenuList
				disablePadding
				dense
				sx={{
					p: "8px",
					"& > *": {
						borderRadius: 1,
					},
				}}
			>
				<MenuItem onClick={handleSignOut} sx={{ color: "error.main" }}>
					Sign out
				</MenuItem>
			</MenuList>
		</Popover>
	);
};

AccountPopover.propTypes = {
	anchorEl: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.bool.isRequired,
};
