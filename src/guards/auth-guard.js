import PropTypes from "prop-types";
import { useAuthContext } from "../contexts/auth-context";
import { Navigate } from "react-router-dom";

export const AuthGuard = (props) => {
	const { children } = props;
	const { isAuthenticated } = useAuthContext();

	if (isAuthenticated) {
		return <>{children}</>;
	} else {
		return <Navigate to="/user/login" />;
	}
};

AuthGuard.propTypes = {
	children: PropTypes.node.isRequired,
};
