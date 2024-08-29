import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

import AuthCodeInput from "./auth-code-input";
import { useAuth } from "../hooks/use-auth";

const AuthCodeInputModal = ({ openModal, setOpenModal, regToken }) => {
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const auth = useAuth();

	// auto submit the form when the value is 6 characters long
	useEffect(() => {
		if (value.length === 6) {
			handleSubmit();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const res = await auth.signIn(value);
			if (res && res.status === 200) {
				setLoading(false);
				closeAndNavigate();
			}
		} catch (error) {
			setLoading(false);
			return toast.warning(error.message);
		}
	};

	const closeAndNavigate = async () => {
		setOpenModal(!openModal);
		await auth.fetchUserData();
		navigate("/");
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
					p: 4,
					borderRadius: 2,
				}}
			>
				<Typography sx={{ mb: 2 }} variant="h6" gutterBottom>
					Enter the OTP sent to your email
				</Typography>

				<AuthCodeInput length={6} onChange={setValue} />

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
							{loading ? "Verifying..." : "Verify"}
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Modal>
	);
};

export default AuthCodeInputModal;
