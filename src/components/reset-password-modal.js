import { useState } from "react";
import {
	Modal,
	Box,
	Button,
	Grid,
	Container,
	Typography,
	TextField,
} from "@mui/material";

import { toast } from "react-toastify";
import { verifyTokenAndResetPassword } from "../services/vendor-api-Services";

const ResetPasswordModal = ({ openModal, setOpenModal, token }) => {
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const res = await verifyTokenAndResetPassword({
				token: token,
				newPassword: password,
			});
			if (res && res.status === 200) {
				setLoading(false);
				setOpenModal(!openModal);
				toast.success(res.message);
			}
		} catch (error) {
			toast.warning(error.message);
			setLoading(false);
		}
	};

	return (
		<Modal
			// this makes the modal stay open when user clicks outside
			disableEnforceFocus={true}
			open={openModal}
			aria-labelledby="auth-code-input-modal"
			aria-describedby="auth-code-input-modal-description"
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					py: 4,
					borderRadius: 2,
				}}
			>
				<Container>
					<Typography sx={{ mb: 2 }} gutterBottom>
						Enter new password
					</Typography>
					<Box component="form">
						<TextField
							label="New Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							margin="normal"
							required
						/>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Button
									sx={{ mt: 2 }}
									variant="contained"
									color="primary"
									onClick={() => setOpenModal(false)}
								>
									Cancel
								</Button>
							</Grid>
							<Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
								<Button
									sx={{ mt: 2 }}
									onClick={handleSubmit}
									disabled={loading}
									color="info"
									variant="contained"
								>
									{loading ? "Loading..." : "Submit"}
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</Box>
		</Modal>
	);
};

export default ResetPasswordModal;
