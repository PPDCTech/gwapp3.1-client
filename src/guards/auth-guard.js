import { useEffect, useState } from "react";
import { Dialog, Typography, Button, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PropTypes from "prop-types";
import { useAuthContext } from "../contexts/auth-context";
import { jwtDecode } from "jwt-decode";

export const AuthGuard = (props) => {
	const { children } = props;
	const { isAuthenticated } = useAuthContext();
	const [isSessionExpired, setIsSessionExpired] = useState(false);

	const [openModal, setOpenModal] = useState(false);

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
						setOpenModal(true);
					}
				} catch (error) {
					console.error("Failed to decode token:", error);
					setIsSessionExpired(true);
					setOpenModal(true);
				}
			} else {
				setIsSessionExpired(true);
				setOpenModal(true);
			}
		};
		checkAuthStatus();
	}, []);

	const handleLogout = () => {
		setOpenModal(false);
		window.localStorage.removeItem("token");
		window.localStorage.removeItem("authenticated");
		window.localStorage.removeItem("gwapp_userId");
		window.localStorage.removeItem("tokenExpiration");
		window.localStorage.clear();
		window.location.href = "/user/login";
	};

	if (isAuthenticated) {
		return <>{children}</>;
	}
	if (isSessionExpired) {
		return (
			<div>
				<Dialog open={openModal} maxWidth="sm">
					<Box
						sx={{
							bgcolor: "background.paper",
							boxShadow: 24,
							p: 2,
							ml: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<svg
							id="loader"
							width="285"
							height="65"
							viewBox="0 0 285 65"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M200.75 59V43.5312H203.812C207.317 43.5312 210.409 43.1391 213.028 42.2822L213.028 42.2823L213.041 42.278C215.605 41.4231 217.806 40.2242 219.543 38.6152L219.55 38.6085L219.557 38.6017C221.241 37.0174 222.488 35.1617 223.255 33.0452C224.005 31.0098 224.375 28.8747 224.375 26.6562C224.375 21.7957 222.802 17.7369 219.397 14.8732C216.021 11.9958 210.999 10.8125 204.875 10.8125H192.938H190.438V13.3125V59V61.5H192.938H198.25H200.75V59ZM200.75 33.9688V20.3438H204.375C208.29 20.3438 210.65 21.073 211.938 22.0706L211.945 22.0757L211.952 22.0809C213.118 22.971 213.875 24.399 213.875 26.875C213.875 28.8713 213.456 30.1971 212.855 31.0714C212.25 31.9304 211.283 32.657 209.74 33.1496L209.732 33.152C208.125 33.6706 205.978 33.9688 203.219 33.9688H200.75Z"
								stroke="#006C37"
								strokeWidth="3"
							/>
							<path
								d="M162.25 59V43.5312H165.312C168.817 43.5312 171.909 43.1391 174.528 42.2822L174.528 42.2823L174.541 42.278C177.105 41.4231 179.306 40.2242 181.043 38.6152L181.05 38.6085L181.057 38.6017C182.741 37.0174 183.988 35.1617 184.755 33.0452C185.505 31.0098 185.875 28.8747 185.875 26.6562C185.875 21.7957 184.302 17.7369 180.897 14.8732C177.521 11.9958 172.499 10.8125 166.375 10.8125H154.438H151.938V13.3125V59V61.5H154.438H159.75H162.25V59ZM162.25 33.9688V20.3438H165.875C169.79 20.3438 172.15 21.073 173.438 22.0706L173.445 22.0757L173.452 22.0809C174.618 22.971 175.375 24.399 175.375 26.875C175.375 28.8713 174.956 30.1971 174.355 31.0714C173.75 31.9304 172.783 32.657 171.24 33.1496L171.232 33.152C169.625 33.6706 167.478 33.9688 164.719 33.9688H162.25Z"
								stroke="#006C37"
								strokeWidth="3"
							/>
							<path
								d="M140.263 59.9042L140.882 61.5H142.594H148.094H151.742L150.425 58.0979L132.675 12.2229L132.057 10.625H130.344H127.802L127.471 9.63304L127.229 10.625H125.562H123.854L123.233 12.2174L105.358 58.0924L104.03 61.5H107.688H113.062H114.778L115.395 59.8998L120.371 47H135.257L140.263 59.9042ZM124.053 37.2812L127.951 26.9549L131.781 37.2812H124.053Z"
								stroke="#006C37"
								strokeWidth="3"
							/>
							<path
								d="M109.134 13.9584L109.975 10.8125H106.719H101.156H99.2167L98.7347 12.6912L91.5011 40.8867L83.0197 12.5946L82.4855 10.8125H80.625H75.1562H73.2782L72.7552 12.6163L64.6218 40.6655L57.453 12.6919L56.9714 10.8125H55.0312H49.5H46.25L47.0836 13.9538L59.2086 59.6413L59.7019 61.5H61.625H66.9688H68.8524L69.3718 59.6894L77.9453 29.8037L86.7582 59.7067L87.2867 61.5H89.1562H94.5H96.4193L96.9151 59.6459L109.134 13.9584Z"
								stroke="#006C37"
								strokeWidth="3"
							/>
							<path
								d="M25.2812 32.5625H27.7812H43.75H46.25V35.0625V57.2188V59.0108L44.5529 59.5863C42.0193 60.4455 39.4113 61.0835 36.7307 61.5011M25.2812 32.5625L36.3438 59.0312M25.2812 32.5625V35.0625V39.8125V42.3125H27.7812H35.9375M25.2812 32.5625L35.9375 42.3125M36.7307 61.5011C36.7299 61.5012 36.7292 61.5014 36.7285 61.5015L36.3438 59.0312M36.7307 61.5011C36.731 61.5011 36.7313 61.501 36.7316 61.501L36.3438 59.0312M36.7307 61.5011C34.0571 61.9209 31.1018 62.125 27.875 62.125C22.7961 62.125 18.3278 61.1107 14.5901 58.9442L14.5841 58.9407C10.889 56.7853 8.08195 53.7065 6.18558 49.7732L6.18306 49.768C4.30013 45.8394 3.40625 41.2766 3.40625 36.1562C3.40625 31.0974 4.39959 26.5582 6.47549 22.6163L6.48087 22.6061L6.4809 22.6061C8.58545 18.6542 11.6321 15.5743 15.5737 13.4047M36.3438 59.0312C33.8229 59.4271 31 59.625 27.875 59.625C23.125 59.625 19.1146 58.6771 15.8438 56.7812C12.5938 54.8854 10.125 52.1875 8.4375 48.6875C6.75 45.1667 5.90625 40.9896 5.90625 36.1562C5.90625 31.4271 6.83333 27.3021 8.6875 23.7812C10.5625 20.2604 13.2604 17.5312 16.7812 15.5938L15.5715 13.4059C15.5723 13.4055 15.573 13.4051 15.5737 13.4047M15.5737 13.4047C19.5599 11.2012 24.2451 10.1562 29.5312 10.1562C32.2254 10.1562 34.8014 10.4098 37.2532 10.9261C39.6988 11.4161 41.9919 12.1221 44.1245 13.0522L46.4218 14.0543L45.414 16.349L43.3827 20.974L42.3834 23.2494L40.1021 22.2637C38.5516 21.5937 36.8141 21.009 34.882 20.5162L34.8761 20.5146C33.0667 20.0483 31.183 19.8125 29.2188 19.8125C25.8384 19.8125 23.0929 20.5088 20.88 21.7872C18.6684 23.0767 16.972 24.8855 15.7673 27.2743C14.5796 29.6705 13.9375 32.6048 13.9375 36.1562C13.9375 39.703 14.5093 42.6727 15.5734 45.127C16.597 47.4674 18.1648 49.2521 20.3175 50.5438C22.4196 51.805 25.289 52.5312 29.0938 52.5312C31.0639 52.5312 32.6944 52.4217 34.0069 52.2195C34.6854 52.1046 35.3288 51.9814 35.9375 51.8502V42.3125M15.5737 13.4047L35.9375 42.3125"
								stroke="#006C37"
								strokeWidth="3"
							/>
						</svg>
					</Box>
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
			</div>
		);
	}
};

AuthGuard.propTypes = {
	children: PropTypes.node.isRequired,
};
