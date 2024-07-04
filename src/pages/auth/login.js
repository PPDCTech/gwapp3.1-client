import { useCallback, useState } from "react";
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
} from "@mui/material";
import { useNProgress } from "../../hooks/use-nprogress";
import AuthCodeInputModal from "../../components/auth-code-modal";
import { loginUser } from "../../services/api/auth.api";

const Login = () => {
	useNProgress();
	const [openModal, setOpenModal] = useState(false);

	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [method, setMethod] = useState("email");
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
							<Typography variant="h4">Login</Typography>
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
							<Tab label="Login to your account" value="email" />
							{/* <Tab label="Reset password" value="phoneNumber" /> */}
						</Tabs>
						{method === "email" && (
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
						{method === "phoneNumber" && (
							<div>
								<Typography color="text.secondary">Loading form...</Typography>
							</div>
						)}
					</div>
				</Box>

				<AuthCodeInputModal openModal={openModal} setOpenModal={setOpenModal}  />
			</Box>
		</>
	);
};

export default Login;
