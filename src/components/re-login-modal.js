import { Dialog, Typography, Button, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ReloginModal() {
	const [openModal, setOpenModal] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const checkAuthStatus = () => {
			const token = window.localStorage.getItem("token");

			if (token) {
				const decodedToken = jwtDecode(token);
				const expirationTime = decodedToken.exp * 1000;
				const isExpired = Date.now() > expirationTime;

				if (isExpired) {
					setOpenModal(true);
				}
			}
		};

		checkAuthStatus();
	}, [location]);

	// Clear the local storage and browser tab cookies
	const handleLogout = () => {
		setOpenModal(false);
		window.localStorage.removeItem("token");
		window.localStorage.removeItem("authenticated");
		window.localStorage.removeItem("gwapp_userId");
		window.localStorage.removeItem("tokenExpiration");
		window.localStorage.clear();
		window.location.href = "/user/login";
	};

	return (
		<Dialog open={openModal} maxWidth="sm">
			<Box
				sx={{
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 2,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<InfoIcon sx={{ fontSize: 40, color: "primary.main" }} />
				<Typography variant="h6" align="center">
					Session Expired
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
					<Typography
						variant="body1"
						align="center"
						sx={{ display: "flex", alignItems: "center" }}
					>
						Login again to continue
						<InfoIcon sx={{ ml: 1 }} />
					</Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleLogout}
					>
						Yes
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}

export default ReloginModal;
