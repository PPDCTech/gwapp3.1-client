import { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import io from "socket.io-client";
import { withAuthGuard } from "../../hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useLocation } from "react-router-dom";
// import { SOCKET_API } from "../../services/base-url";
import ReloginModal from "../../components/re-login-modal";
import { useAuthContext } from "../../contexts/auth-context";
import { jwtDecode } from "jwt-decode";
import { SessionModal } from "../../components/session-check-modal";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
	display: "flex",
	flex: "1 1 auto",
	maxWidth: "100%",
	[theme.breakpoints.up("lg")]: {
		paddingLeft: SIDE_NAV_WIDTH,
	},
}));

const LayoutContainer = styled("div")({
	display: "flex",
	flex: "1 1 auto",
	flexDirection: "column",
	width: "100%",
});

export const Layout = withAuthGuard((props) => {
	const { children } = props;
	const location = useLocation();
	const [openNav, setOpenNav] = useState(false);
	const { signOut } = useAuthContext();
	const [isSessionExpired, setIsSessionExpired] = useState(false);

	// useEffect(() => {
	// 	const socket = io(SOCKET_API, { withCredentials: true });
	// 	socket.on("ping", (data) => {
	// 		console.log(`Received ping: ${data}`);
	// 	});

	// 	return () => {
	// 		socket.disconnect();
	// 	};
	// }, []);

	useEffect(() => {
		const checkAuthStatus = () => {
			const token = window.localStorage.getItem("token");

			if (token) {
				try {
					const decodedToken = jwtDecode(token);
					const expirationTime = decodedToken.exp * 1000;
					const isExpired = Date.now() > expirationTime;

					if (isExpired) {
						setIsSessionExpired(true);
					}
				} catch (error) {
					console.error("Failed to decode token:", error);
					setIsSessionExpired(true);
				}
			} else {
				setIsSessionExpired(true);
			}
		};

		// Run checkAuthStatus initially
		checkAuthStatus();

		// Set up interval to check time every minute
		const intervalId = setInterval(() => {
			const now = new Date();
			if (now.getHours() === 12 && now.getMinutes() === 0) {
				// Check if it's 12:00 PM (noon) and reload the page
				window.location.reload();
			}
		}, 60000); // Check every minute

		return () => clearInterval(intervalId);
	}, []);

	const handleLogout = () => {
		setIsSessionExpired(false);
		signOut();
	};

	const handlePathnameChange = useCallback(() => {
		if (openNav) {
			setOpenNav(false);
		}
	}, [openNav]);

	useEffect(
		() => {
			handlePathnameChange();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[location.pathname],
	);

	return (
		<>
			<TopNav onNavOpen={() => setOpenNav(true)} />
			<SideNav onClose={() => setOpenNav(false)} open={openNav} />
			<SessionModal
				openModal={isSessionExpired}
				handleLogout={() => handleLogout()}
			/>
			<LayoutRoot>
				<LayoutContainer>{children}</LayoutContainer>
			</LayoutRoot>
			<ReloginModal />
		</>
	);
});
