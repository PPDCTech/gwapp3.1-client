import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import GwappLoading from "./components/gwappload/GwappLoading";

const App = React.lazy(() => import("./App"));

const Main = () => {
	return (
		<Suspense fallback={<GwappLoading />}>
			<App />
		</Suspense>
	);
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
