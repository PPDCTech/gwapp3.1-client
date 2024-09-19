import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout as AuthLayout } from "./layouts/auth/layout";
import { Layout as DashboardLayout } from "./layouts/dashboard/layout";
import Error from "./pages/404";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Account from "./pages/accounts";
import Bin from "./pages/bin";
import Overview from "./pages/overview";
import Profile from "./pages/profile";
import Projects from "./pages/projects";
import Requisitions from "./pages/requisitions";
import Retirements from "./pages/retirements";
import Members from "./pages/members";
import VendorList from "./pages/vendor-list";
import EditProfile from "./pages/vendor-profile-edit";
import CompleteRegistration from "./pages/complete-registration";
import VendorProfile from "./pages/vendor-profile";
import ContractList from "./pages/contract-list";
import ApplicantList from "./pages/applicant-list";
import PublicRegister from "./pages/auth/public-register";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/vendor/complete-registration"
					element={<CompleteRegistration />}
				/>
				<Route path="/public/vendor/registration" element={<PublicRegister />} />
				<Route
					path="/user/login"
					element={
						<AuthLayout>
							<Login />
						</AuthLayout>
					}
				/>
				<Route
					path="/vendor/password-reset"
					element={
						<AuthLayout>
							<Login />
						</AuthLayout>
					}
				/>
				<Route
					path="/vendor/register"
					element={
						<AuthLayout>
							<Register />
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
					path="/vendor/:vendorId/profile"
					element={
						<DashboardLayout>
							<VendorProfile />
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
					path="/accounts"
					element={
						<DashboardLayout>
							<Account />
						</DashboardLayout>
					}
				/>
				<Route
					path="/vendor-list"
					element={
						<DashboardLayout>
							<VendorList />
						</DashboardLayout>
					}
				/>
				<Route
					path="/vendor/:vendorId/update-profile"
					element={
						<DashboardLayout>
							<EditProfile />
						</DashboardLayout>
					}
				/>
				<Route
					path="/contracts"
					element={
						<DashboardLayout>
							<ContractList />
						</DashboardLayout>
					}
				/>
				<Route
					path="/contract/applicants"
					element={
						<DashboardLayout>
							<ApplicantList />
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
