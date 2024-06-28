import { useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "../contexts/auth-context";
import GwappLoading from "../components/gwappload/GwappLoading";
import { jwtDecode } from "jwt-decode";

export const AuthGuard = (props) => {
	const { children } = props;
	const { isAuthenticated } = useAuthContext();

	useEffect(() => {
		const checkAuthStatus = () => {
			const token = window.localStorage.getItem("token");

			if (token) {
				try {
					const decodedToken = jwtDecode(token);
					const expirationTime = decodedToken.exp * 1000;
					const isExpired = Date.now() > expirationTime;

					if (isExpired) {
						window.localStorage.removeItem("token");
						window.localStorage.removeItem("authenticated");
						window.localStorage.removeItem("gwapp_userId");
						console.log("Token expired, redirecting");
						window.location.href = "/user/login";
					}
				} catch (error) {
					console.error("Failed to decode token:", error);
					window.localStorage.removeItem("token");
					window.localStorage.removeItem("authenticated");
					window.localStorage.removeItem("gwapp_userId");
					window.location.href = "/user/login";
				}
			}

			if (!isAuthenticated) {
				window.localStorage.removeItem("token");
				window.localStorage.removeItem("authenticated");
				window.localStorage.removeItem("gwapp_userId");
				console.log("Not authenticated, redirecting");
				window.location.href = "/user/login";
			}
		};

		checkAuthStatus();
	}, [isAuthenticated]);

	return isAuthenticated ? children : <GwappLoading />;
};

AuthGuard.propTypes = {
	children: PropTypes.node.isRequired,
};
