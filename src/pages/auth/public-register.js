import { Link as NextLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useNProgress } from "../../hooks/use-nprogress";
import { signup } from "../../services/vendor-api-Services";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info"; // Add an info icon for the notice

const PublicRegister = () => {
	useNProgress();
	const navigate = useNavigate();
	const auth = useAuth();

	const formik = useFormik({
		initialValues: {
			email: "",
			phoneNumber: "",
			name: "",
			password: "",
			submit: null,
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Must be a valid email")
				.max(100)
				.required("Email is required"),
			phoneNumber: Yup.string().max(15).required("Phone number is required"),
			name: Yup.string().max(255).required("Name is required"),
			password: Yup.string().max(65).required("Password is required"),
		}),
		onSubmit: async (values, helpers) => {
			try {
				const res = await signup({
					email: values.email,
					name: values.name,
					password: values.password,
					phoneNumber: values.phoneNumber,
				});
				if (res && res.status === 201) {
					navigate("/user/login?vendor=true");
					toast.success("Account created successfully. Please check your email");
				}
			} catch (err) {
				helpers.setStatus({ success: false });
				helpers.setErrors({ submit: err.message });
				helpers.setSubmitting(false);
				toast.error(err.message);
			}
		},
	});

	return (
		<Box
			sx={{
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
						<Typography variant="h6">
							Sign up to our vendor list to receive firsthand information on
							procurement listings and advertisements.
						</Typography>
						<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
							<InfoIcon color="info" />
							<Typography variant="body2">
								Fill out the form, and a unique link will be sent to your email for
								profile completion.
							</Typography>
						</Stack>
					</Stack>
					<form noValidate onSubmit={formik.handleSubmit}>
						<Stack spacing={3}>
							<TextField
								error={!!(formik.touched.name && formik.errors.name)}
								fullWidth
								helperText={formik.touched.name && formik.errors.name}
								label="Name"
								name="name"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.name}
							/>
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
							<TextField
								error={!!(formik.touched.phoneNumber && formik.errors.phoneNumber)}
								fullWidth
								helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
								label="Phone Number"
								name="phoneNumber"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="number"
								value={formik.values.phoneNumber}
							/>
							<TextField
								error={!!(formik.touched.password && formik.errors.password)}
								fullWidth
								helperText={formik.touched.password && formik.errors.password}
								label="Password"
								name="password"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="password"
								value={formik.values.password}
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
						>
							Submit
						</Button>
					</form>
					<Stack spacing={1} sx={{ my: 2 }}>
						<Typography color="text.secondary" variant="body2">
							Already have an account? &nbsp;
							<Link
								component={Button}
								onClick={() => navigate("/user/login?vendor=true")}
								underline="hover"
								variant="subtitle2"
								sx={{ p: 1 }}
							>
								Log in
							</Link>
						</Typography>
					</Stack>
				</div>
			</Box>
		</Box>
	);
};

export default PublicRegister;
