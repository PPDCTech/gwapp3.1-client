import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

import { fetchSingleUser } from "../services/api/users.api";
import { verifyLogin } from "../services/api/auth.api";

const HANDLERS = {
	INITIALIZE: "INITIALIZE",
	SIGN_IN: "SIGN_IN",
	SIGN_OUT: "SIGN_OUT",
	SET_USER: "SET_USER",
};

const initialState = {
	isAuthenticated: false,
	isLoading: true,
	user: null,
};

const handlers = {
	[HANDLERS.INITIALIZE]: (state, action) => {
		const user = action.payload;

		return {
			...state,
			...(user // if payload (user) is provided, then is authenticated
				? {
						isAuthenticated: true,
						isLoading: false,
						user,
				  }
				: {
						isLoading: false,
				  }),
		};
	},
	[HANDLERS.SIGN_IN]: (state, action) => {
		const user = action.payload;

		return {
			...state,
			isAuthenticated: true,
			user,
		};
	},
	[HANDLERS.SIGN_OUT]: (state) => {
		return {
			...state,
			isAuthenticated: false,
			user: null,
		};
	},
	[HANDLERS.SET_USER]: (state, action) => ({
		...state,
		isAuthenticated: true,
		user: action.payload,
	}),
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

// This context is to propagate authentication state through the App tree.
export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
	const { children } = props;
	const [state, dispatch] = useReducer(reducer, initialState);
	const initialized = useRef(false);

	const setUser = (user) => {
		dispatch({
			type: HANDLERS.SET_USER,
			payload: user,
		});
	};

	const isTokenExpired = () => {
		const token = window.localStorage.getItem("token");

		if (token) {
			const decodedToken = jwtDecode(token);
			const expirationTime = decodedToken.exp * 1000;
			const isExpired = Date.now() > expirationTime;

			return isExpired; // return true if token is expired
		}
	};

	const initialize = async () => {
		// Prevent from calling twice in development mode with React.StrictMode enabled
		if (initialized.current) {
			return;
		}

		initialized.current = true;

		let isAuthenticated = false;

		try {
			isAuthenticated = window.localStorage.getItem("authenticated") === "true";
		} catch (err) {
			console.error(err);
		}

		if (isAuthenticated) {
			const userId = window.localStorage.getItem("gwapp_userId");

			if (userId) {
				const response = await fetchSingleUser(userId);
				const user = response?.data;

				dispatch({
					type: HANDLERS.INITIALIZE,
					payload: user,
				});
			}
		} else {
			dispatch({
				type: HANDLERS.INITIALIZE,
			});

			if (isTokenExpired()) {
				window.localStorage.removeItem("token");
				window.localStorage.removeItem("authenticated");
				window.localStorage.removeItem("gwapp_userId");
				window.localStorage.clear();
				window.location.href = "/user/login";
			}
		}
	};

	useEffect(
		() => {
			initialize();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const signIn = async (password) => {
		try {
			const response = await verifyLogin(password);

			const { userData } = response.data;
			const { status, token } = userData;

			if (status === "inactive") {
				throw new Error("User account is suspended.");
			}

			window.localStorage.setItem("gwapp_userId", userData._id);
			window.localStorage.setItem("authenticated", "true");
			window.localStorage.setItem("token", token);

			dispatch({
				type: HANDLERS.SIGN_IN,
				payload: userData,
			});
			return response;
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const signOut = () => {
		window.localStorage.removeItem("token");
		window.localStorage.removeItem("authenticated");
		window.localStorage.removeItem("gwapp_userId");
		window.localStorage.clear();

		dispatch({
			type: HANDLERS.SIGN_OUT,
		});
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				setUser,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
