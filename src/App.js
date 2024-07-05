import React, { useEffect } from "react";
import io from "socket.io-client";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "./contexts/auth-context";
import { createTheme } from "./theme";
import { createEmotionCache } from "./utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NetworkStatusIndicator } from "./components/check-status";
import "./styles/common.css";
import "./styles/gwapploading.css";
import Router from "./Router";
import GwappLoading from "./components/gwappload/GwappLoading";
import { SOCKET_API } from "./services/base-url";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
	const { emotionCache = clientSideEmotionCache } = props;
	const theme = createTheme();
	useEffect(() => {
		const socket = io(SOCKET_API);
		socket.on("ping", (data) => {
			console.log(`Received ping: ${data}`);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<CacheProvider value={emotionCache}>
			<>
				<NetworkStatusIndicator />
			</>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<AuthProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<ToastContainer theme="colored" />
						<AuthConsumer>
							{(auth) => (auth.isLoading ? <GwappLoading /> : <Router />)}
						</AuthConsumer>
					</ThemeProvider>
				</AuthProvider>
			</LocalizationProvider>
		</CacheProvider>
	);
};

export default App;
