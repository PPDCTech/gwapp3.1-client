import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout as AuthLayout } from "./layouts/auth/layout";
import { Layout as DashboardLayout } from "./layouts/dashboard/layout";
import Error from "./pages/404";
import Login from "./pages/auth/login";
import Account from "./pages/accounts";
import Bin from "./pages/bin";
import Overview from "./pages/overview";
import Profile from "./pages/profile";
import Projects from "./pages/projects";
import Requisitions from "./pages/requisitions";
import Retirements from "./pages/retirements";
import Vendors from "./pages/vendors";
import Members from "./pages/members";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/user/login"
					element={
						<AuthLayout>
							<Login />
						</AuthLayout>
					}
				/>
				<Route
					path="/"
					element={
						<DashboardLayout>
							<Overview />
						</DashboardLayout>
					}
				/>
				<Route
					path="/profile"
					element={
						<DashboardLayout>
							<Profile />
						</DashboardLayout>
					}
				/>
				<Route
					path="/projects"
					element={
						<DashboardLayout>
							<Projects />
						</DashboardLayout>
					}
				/>
				<Route
					path="/requisitions"
					element={
						<DashboardLayout>
							<Requisitions />
						</DashboardLayout>
					}
				/>
				<Route
					path="/retirements"
					element={
						<DashboardLayout>
							<Retirements />
						</DashboardLayout>
					}
				/>
				<Route
					path="/members"
					element={
						<DashboardLayout>
							<Members />
						</DashboardLayout>
					}
				/>
				<Route
					path="/account"
					element={
						<DashboardLayout>
							<Account />
						</DashboardLayout>
					}
				/>
				<Route
					path="/vendors"
					element={
						<DashboardLayout>
							<Vendors />
						</DashboardLayout>
					}
				/>
				<Route
					path="/bin"
					element={
						<DashboardLayout>
							<Bin />
						</DashboardLayout>
					}
				/>
				<Route path="*" element={<Error />} />
				{/* Add more routes as needed */}
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
