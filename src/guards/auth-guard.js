import { useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "../contexts/auth-context";
import GwappLoading from "../components/gwappload/GwappLoading";

export const AuthGuard = (props) => {
	const { children } = props;
	const { isAuthenticated } = useAuthContext();

	useEffect(() => {
		if (!isAuthenticated) {
			// clear local storage
			window.localStorage.removeItem("token");
			window.localStorage.removeItem("authenticated");
			window.localStorage.removeItem("gwapp_userId");
			console.log("Not authenticated, redirecting");
			// Store continue URL in sessionStorage
			sessionStorage.setItem(
				"continueUrl",
				window.location.pathname !== "/" ? window.location.pathname : "",
			);
			// Redirect to login page
			window.location.href = "/user/login";
		}
	}, [isAuthenticated]);

	return isAuthenticated ? children : <GwappLoading />;
};

AuthGuard.propTypes = {
	children: PropTypes.node,
};
