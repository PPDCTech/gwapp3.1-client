import { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { addNewUser } from "../services/api/users.api";

const AddMemberModal = ({
	open,
	onClose,
	fetchActiveMembers,
	activePage,
	rowsPerPage,
}) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setLoading(true);

			const formValues = {
				name,
				email,
			};

			if (!formValues.name || !formValues.email) {
				setLoading(false);
				return toast.warning("Missing parameters");
			}

			// validate email format
			const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			if (!emailPattern.test(formValues.email)) {
				setLoading(false);
				return toast.warning("Invalid email format");
			}

			const response = await addNewUser(formValues);
			if (response.status === 201) {
				toast.success("User added successfully");
				fetchActiveMembers(activePage, rowsPerPage);
				onClose();
			}
		} catch (error) {
			toast.error(`Error adding user\n${error.message}`);
			console.log("Error adding user::", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ my: 2 }}>Add New Member</DialogTitle>
			<DialogContent>
				<FormControl fullWidth>
					<TextField
						value={name}
						onChange={(e) => setName(e.target.value)}
						fullWidth
						label="User Name"
						variant="outlined"
						margin="normal"
					/>
				</FormControl>
				<FormControl fullWidth>
					<TextField
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						fullWidth
						label="User Email"
						variant="outlined"
						margin="normal"
					/>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary" variant="contained">
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color="success"
					variant="contained"
					disabled={loading}
				>
					{loading ? "Adding..." : "Add"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddMemberModal;
