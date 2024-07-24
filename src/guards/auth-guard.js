import PropTypes from "prop-types";
import { useAuthContext } from "../contexts/auth-context";

export const AuthGuard = (props) => {
	const { children } = props;
	const { isAuthenticated } = useAuthContext();

	if (isAuthenticated) {
		return <>{children}</>;
	}
};

AuthGuard.propTypes = {
	children: PropTypes.node.isRequired,
};
