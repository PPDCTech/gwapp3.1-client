import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	Box,
	Button,
	Stack,
	Tab,
	Tabs,
	TextField,
	Typography,
	Container,
	Link,
} from "@mui/material";
import { useNProgress } from "../../hooks/use-nprogress";
import AuthCodeInputModal from "../../components/auth-code-modal";
import { loginUser } from "../../services/api/auth.api";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use-auth";
import PasswordResetModal from "../../components/password-reset-modal";
import ResetPasswordModal from "../../components/reset-password-modal";

const Login = () => {
	useNProgress();
	const auth = useAuth();
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);
	const [openResetModal, setOpenResetModal] = useState(false);
	const [newToken, setNewToken] = useState("");

	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [method, setMethod] = useState("staff");

	useEffect(() => {
		// search if vendor = true set method to vendor
		const urlSearchParams = new URLSearchParams(window.location.search);
		const vendor = urlSearchParams.get("vendor");
		if (vendor === "true") {
			setMethod("vendor");
		}
	}, []);

	useEffect(() => {
		// search if vendor = true set method to vendor
		const urlSearchParams = new URLSearchParams(window.location.search);
		const open = urlSearchParams.get("open");
		const token = urlSearchParams.get("token");
		if (open === "true" && token) {
			setNewToken(token);
			setOpenResetModal(true);
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			email: "",
			submit: null,
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Must be a valid email")
				.max(255)
				.required("Email is required"),
		}),
		onSubmit: async (values, helpers) => {
			setLoadingSubmit(true);
			try {
				const response = await loginUser(values.email);
				if (response && response.status === 200) {
					// show modal
					setOpenModal(true);
					setLoadingSubmit(false);
				} else {
					helpers.setStatus({ success: false });
					helpers.setErrors({
						submit: "Sorry, something went wrong. Please try again.",
					});
					helpers.setSubmitting(false);
				}
			} catch (err) {
				helpers.setStatus({ success: false });
				helpers.setErrors({ submit: err.message });
				helpers.setSubmitting(false);
			} finally {
				setLoadingSubmit(false);
			}
		},
	});

	const handleMethodChange = useCallback((event, value) => {
		setMethod(value);
	}, []);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [submiting, setSubmiting] = useState(false);

	const [isForgotPassword, setIsForgotPassword] = useState(false);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmiting(true);
		try {
			if (!formData.email || !formData.password) {
				toast.error("All fields are required");
				setSubmiting(false);
				return;
			}
			 await auth.vendorSignIn(formData);
			toast.success("Login successful");
			navigate("/profile");
			// reload window
			window.location.reload();
			setSubmiting(false);
		} catch (error) {
			console.log("Login failed! ", error.message);
			toast.error("Login failed! " + error.message);
			setSubmiting(false);
		}
	};

	return (
		<>
			<Box
				sx={{
					backgroundColor: "background.paper",
					flex: "1 1 auto",
					alignItems: "center",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						maxWidth: 550,
						px: 3,
						py: "100px",
						width: "100%",
					}}
				>
					<div>
						<Stack spacing={1} sx={{ mb: 3 }}>
							<Typography variant="h6">Login</Typography>
						</Stack>
						<Tabs
							onChange={handleMethodChange}
							sx={{
								mb: 3,
								"& .MuiTab-root.Mui-selected": {
									color: "success.dark",
								},
								"& .MuiTabs-indicator": {
									backgroundColor: "success.dark",
								},
							}}
							value={method}
						>
							<Tab label="Staff" value="staff" />
							<Tab label="Vendor" value="vendor" />
						</Tabs>
						{method === "staff" && (
							<form noValidate onSubmit={formik.handleSubmit}>
								<Stack spacing={3}>
									<TextField
										error={!!(formik.touched.email && formik.errors.email)}
										fullWidth
										helperText={formik.touched.email && formik.errors.email}
										label="Email Address"
										name="email"
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										type="email"
										value={formik.values.email}
									/>
								</Stack>

								{formik.errors.submit && (
									<Typography color="error" sx={{ mt: 3 }} variant="body2">
										{formik.errors.submit}
									</Typography>
								)}
								<Button
									fullWidth
									size="large"
									sx={{
										mt: 3,
										backgroundColor: "success.darkest",
										"&:hover": {
											backgroundColor: "success.main",
											transform: "scale(1.01)",
											boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
										},
									}}
									type="submit"
									variant="contained"
									disabled={loadingSubmit}
								>
									{loadingSubmit ? "Logging in..." : "Continue"}
								</Button>
							</form>
						)}
						{method === "vendor" && (
							<Container>
								<Box component="form" onSubmit={handleSubmit}>
									<TextField
										label="Email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleInputChange}
										fullWidth
										margin="normal"
										required
									/>
									<TextField
										label="Password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleInputChange}
										fullWidth
										margin="normal"
										required
									/>
									<Button
										fullWidth
										size="large"
										sx={{
											mt: 3,
											backgroundColor: "success.darkest",
											"&:hover": {
												backgroundColor: "success.main",
												transform: "scale(1.01)",
												boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
											},
										}}
										type="submit"
										variant="contained"
										disabled={submiting}
									>
										{submiting ? "Processing..." : "Login"}
									</Button>
								</Box>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mb: 2,
										mt: 2,
									}}
								>
									<Box>
										<Typography color="text.secondary" variant="body2">
											No vendor account yet?
											<Link
												component={Button}
												onClick={() => navigate("/vendor/register")}
												underline="hover"
												variant="subtitle2"
												sx={{ p: 1 }}
											>
												Register
											</Link>
										</Typography>
									</Box>
									<Box>
										<Typography color="text.secondary" variant="body2">
											Forgot Password?
											<Link
												component={Button}
												onClick={() => setIsForgotPassword(true)}
												underline="hover"
												variant="subtitle2"
												sx={{ p: 1 }}
											>
												Reset
											</Link>
										</Typography>
									</Box>
								</Box>
							</Container>
						)}
					</div>
				</Box>

				<AuthCodeInputModal openModal={openModal} setOpenModal={setOpenModal} />
				<PasswordResetModal
					openModal={isForgotPassword}
					setOpenModal={setIsForgotPassword}
				/>
				<ResetPasswordModal
					openModal={openResetModal}
					setOpenModal={setOpenResetModal}
					token={newToken}
				/>
			</Box>
		</>
	);
};

export default Login;
