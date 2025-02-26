import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Logo } from "../../components/logo";
import { Link } from "react-router-dom";
// import { SOCKET_API } from "../../services/base-url";

export const Layout = (props) => {
	const { children } = props;

	// useEffect(() => {
	// 	const socket = io(SOCKET_API, { withCredentials: true });
	// 	socket.on("ping", (data) => {
	// 		console.log(`Received ping: ${data}`);
	// 	});

	// 	return () => {
	// 		socket.disconnect();
	// 	};
	// }, []);

	return (
		<Box
			component="main"
			sx={{
				display: "flex",
				flex: "1 1 auto",
				height: "100vh",
			}}
		>
			<Grid container sx={{ flex: "1 1 auto", minHeight: "100%" }}>
				<Grid
					xs={12}
					lg={6}
					sx={{
						backgroundColor: "background.paper",
						display: "flex",
						flexDirection: "column",
						position: "relative",
					}}
				>
					<Box
						component="header"
						sx={{
							left: 0,
							p: 3,
							position: "fixed",
							top: 0,
							width: "100%",
						}}
					>
						<Box
							component={Link}
							to={"/"}
							sx={{
								display: "inline-flex",
								height: 32,
								width: 32,
							}}
						>
							<Logo />
						</Box>
					</Box>
					{children}
				</Grid>
				<Grid
					xs={12}
					lg={6}
					sx={{
						alignItems: "flex-start",
						background:
							"radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
						backgroundSize: "cover",
						color: "white",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Box sx={{ p: 3, justifyContent: "flex-start" }}>
						<Typography
							align="center"
							color="inherit"
							sx={{
								fontSize: "24px",
								lineHeight: "32px",
								mb: 1,
								mt: 3,
							}}
							variant="h1"
						>
							Welcome to{" "}
							<Box component="a" sx={{ color: "#15B79E" }} target="_blank">
								GWAPP
							</Box>
						</Typography>
						<Typography align="center" sx={{ mb: 3 }} variant="subtitle1">
							A solution by PPDC, to track requisition requests, payment approvals,
							vendor listing, procurement management, and financial report generation.
						</Typography>
						<img
							alt=""
							src="/assets/auth-illustration.svg"
							style={{ width: "100%", height: "auto", objectFit: "contain" }}
						/>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

Layout.propTypes = {
	children: PropTypes.node,
};
