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
import { signin, viewAVendor } from "../services/vendor-api-Services";
import { verifyLogin } from "../services/api/auth.api";

const HANDLERS = {
	INITIALIZE: "INITIALIZE",
	SIGN_IN: "SIGN_IN",
	SIGN_OUT: "SIGN_OUT",
	SET_USER: "SET_USER",
	FETCH_USER_DATA: "FETCH_USER_DATA",
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
			...(user
				? { isAuthenticated: true, isLoading: false, user }
				: { isLoading: false }),
		};
	},
	[HANDLERS.SIGN_IN]: (state, action) => ({
		...state,
		isAuthenticated: true,
		user: action.payload,
	}),
	[HANDLERS.SIGN_OUT]: (state) => ({
		...state,
		isAuthenticated: false,
		user: null,
	}),
	[HANDLERS.SET_USER]: (state, action) => ({
		...state,
		isAuthenticated: true,
		user: action.payload,
	}),
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = ({ children }) => {
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
		const isVendor = window.localStorage.getItem("isVendor") === "true";

		if (token) {
			const decodedToken = jwtDecode(token);
			const expirationTime = decodedToken.exp * 1000;
			const isExpired = Date.now() > expirationTime;

			if (isExpired) {
				if (isVendor) {
					window.localStorage.clear();
					window.location.href = "/user/login?vendor=true";
				} else {
					window.localStorage.clear();
					window.location.href = "/user/login";
				}
			}
			return isExpired;
		}
		return true;
	};

	const initialize = async () => {
		if (initialized.current) return;

		initialized.current = true;

		let isAuthenticated = false;

		try {
			isAuthenticated = window.localStorage.getItem("authenticated") === "true";
		} catch (err) {
			console.error(err);
		}

		if (isAuthenticated) {
			const tokenExpired = isTokenExpired();
			if (tokenExpired) return;

			const userId = window.localStorage.getItem("gwapp_userId");
			const isVendor = window.localStorage.getItem("isVendor") === "true";
			let response;

			if (userId && isVendor) {
				response = await viewAVendor(userId);
			}
			if (userId && !isVendor) {
				response = await fetchSingleUser(userId);
			}
			const user = response?.data;

			dispatch({
				type: HANDLERS.INITIALIZE,
				payload: user,
			});
		} else {
			isTokenExpired();
			dispatch({
				type: HANDLERS.INITIALIZE,
			});
		}
	};

	useEffect(() => {
		initialize();
	}, []);

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

	const vendorSignIn = async (form) => {
		try {
			const response = await signin(form);
			const { vendor } = response;

			window.localStorage.setItem("gwapp_userId", vendor._id);
			window.localStorage.setItem("authenticated", "true");
			window.localStorage.setItem("isVendor", "true");
			window.localStorage.setItem("token", vendor.token);

			dispatch({
				type: HANDLERS.SIGN_IN,
				payload: vendor,
			});
			return response;
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const signOut = () => {
		["token", "authenticated", "gwapp_userId"].forEach((item) =>
			window.localStorage.removeItem(item),
		);
		const isVendor = window.localStorage.getItem("isVendor") === "true";
		if (isVendor) {
			window.localStorage.setItem("isVendor", "false");
			window.location.href = "/user/login?vendor=true";
		}
		window.location.href = "/user/login";

		dispatch({
			type: HANDLERS.SIGN_OUT,
		});
	};

	const fetchUserData = async () => {
		try {
			const userId = window.localStorage.getItem("gwapp_userId");

			const isVendor = window.localStorage.getItem("isVendor") === "true";
			if (userId && isVendor) {
				const response = await viewAVendor(userId);
				const user = response?.data;

				dispatch({
					type: HANDLERS.FETCH_USER_DATA,
					payload: user,
				});
			} else {
				const response = await fetchSingleUser(userId);
				const user = response?.data;

				dispatch({
					type: HANDLERS.FETCH_USER_DATA,
					payload: user,
				});
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ ...state, setUser, signIn, vendorSignIn, signOut, fetchUserData }}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
