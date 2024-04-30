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

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
	const { emotionCache = clientSideEmotionCache } = props;

	const theme = createTheme();

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
							{(auth) => (auth.isLoading ? <SplashScreen /> : <Router />)}
						</AuthConsumer>
					</ThemeProvider>
				</AuthProvider>
			</LocalizationProvider>
		</CacheProvider>
	);
};

export default App;
