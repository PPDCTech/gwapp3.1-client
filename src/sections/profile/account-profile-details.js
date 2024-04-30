import { useCallback, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	TextField,
	Unstable_Grid2 as Grid,
} from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
// import { toast } from "react-toastify";
// import AuthCodeInputModal from "../../components/auth-code-modal";
// import axios from "axios";
// import {
// 	CHANGE_PASSWORD_API,
// 	RESET_PASSWORD_API,
// 	VERIFY_PASSWORD_API,
// } from "../../services/constants";

export const AccountProfileDetails = () => {
	const { user } = useAuth();
	// const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
	// const [code, setCode] = useState("");
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState("");

	const [values, setValues] = useState({
		firstName: user.name.split(" ")[0],
		lastName: user.name.split(" ")[1],
		email: user?.email,
		password: "",
		repeatPassword: "",
		newPassword: "",
	});

	const handleChange = useCallback((event) => {
		setValues((prevState) => ({
			...prevState,
			[event.target.name]: event.target.value,
		}));
	}, []);

	// const handleSubmit = useCallback(
	// 	async (event) => {
	// 		event.preventDefault();

	// 		if (!values.newPassword) return;

	// 		if (String(values.password) !== String(values.repeatPassword)) {
	// 			setError("Passwords don't match");
	// 			return;
	// 		}

	// 		try {
	// 			setLoading(true);

	// 			if (values.password) {
	// 				const is_password_correct = await axios.post(VERIFY_PASSWORD_API, {
	// 					userId: user._id,
	// 					oldPassword: values.password,
	// 				});

	// 				if (is_password_correct.status === 200) {
	// 					setError("");
	// 					const response = await axios.post(CHANGE_PASSWORD_API, {
	// 						email: user?.email,
	// 					});
	// 					if (response.status === 200) {
	// 						setIsCodeModalOpen(true);
	// 					}
	// 				}
	// 			}
	// 		} catch (error) {
	// 			setError("Old password is wrong");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	},
	// 	[
	// 		user?._id,
	// 		user?.email,
	// 		values.newPassword,
	// 		values.password,
	// 		values.repeatPassword,
	// 	],
	// );

	// const handleCodeSubmit = async (codeValue) => {
	// 	try {
	// 		const password_change = await axios.post(RESET_PASSWORD_API, {
	// 			email: user?.email,
	// 			password: values.newPassword,
	// 			resetToken: codeValue,
	// 		});

	// 		if (password_change.status === 200) {
	// 			setIsCodeModalOpen(false);
	// 			toast.success("Password changed successfully");
	// 		}
	// 	} catch (error) {
	// 		toast.error(error);
	// 	}
	// };

	return (
		<>
			{/* <AuthCodeInputModal
				open={isCodeModalOpen}
				onClose={() => setIsCodeModalOpen(false)}
				onSubmit={handleCodeSubmit}
			/> */}

			<form autoComplete="off" noValidate>
				<Card>
					<CardHeader
						subheader="You can change your password, photo and signature"
						title="Profile"
					/>
					<CardContent sx={{ pt: 0 }}>
						<Box sx={{ m: -1.5 }}>
							<Grid container spacing={3}>
								<Grid xs={12} md={6}>
									<TextField
										fullWidth
										helperText="Please specify the first name"
										label="First name"
										name="firstName"
										onChange={handleChange}
										disabled
										value={values.firstName}
									/>
								</Grid>
								<Grid xs={12} md={6}>
									<TextField
										fullWidth
										label="Last name"
										name="lastName"
										onChange={handleChange}
										disabled
										value={values.lastName}
									/>
								</Grid>
								<Grid xs={12} md={12}>
									<TextField
										fullWidth
										label="Email Address"
										name="email"
										onChange={handleChange}
										disabled
										value={values.email}
									/>
								</Grid>
								<Grid xs={12} md={12}>
									<Divider />
								</Grid>
								{/* <Grid xs={12} md={6}>
									<TextField
										fullWidth
										label="Old Password"
										name="password"
										onChange={handleChange}
										type="password"
										value={values.password}
										error={Boolean(error)}
										helperText={error}
									/>
								</Grid> */}
								{/* <Grid xs={12} md={6}>
									<TextField
										fullWidth
										label="Repeat Password"
										name="repeatPassword"
										onChange={handleChange}
										type="password"
										value={values.repeatPassword}
									/>
								</Grid> */}
								{/* <Grid xs={12} md={12}>
									<TextField
										fullWidth
										label="Enter New Password"
										name="newPassword"
										onChange={handleChange}
										type="password"
										value={values.newPassword}
										required
									/>
								</Grid> */}
							</Grid>
						</Box>
					</CardContent>
					{/* <Divider />
					<CardActions sx={{ justifyContent: "flex-end" }}>
						<Button type="submit" variant="contained" color="info" disabled={loading}>
							{loading ? "Please wait.." : "Reset Password"}
						</Button>
					</CardActions> */}
				</Card>
			</form>
		</>
	);
};
