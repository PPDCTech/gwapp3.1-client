import { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
// import { ACCOUNT_CODES_API } from "src/services/constants";
import { indigo } from "../theme/colors";

export const AddAccountCodeModal = ({ onAddNew, user }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [codeValue, setCodeValue] = useState("");
	const [description, setDescription] = useState("");

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setCodeValue("");
		setDescription("");
		setIsOpen(false);
	};

	const handleAddCode = async () => {
		const new_code = {
			value: codeValue,
			description,
		};
		onAddNew(new_code);
		handleClose();
	};

	return (
		<>
			{user?.position?.some((role) =>
				["finance", "financeReviewer", "tech"].includes(role),
			) && (
				<Button variant="outlined" sx={{ color: indigo.main }} onClick={handleOpen}>
					Add New Code
				</Button>
			)}
			<Dialog open={isOpen} onClose={handleClose}>
				<DialogTitle>Add New Account Code</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Code Value"
						value={codeValue}
						onChange={(e) => setCodeValue(e.target.value)}
						variant="outlined"
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						variant="outlined"
						sx={{ mb: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={handleClose}>
						Cancel
					</Button>
					<Button color="success" onClick={handleAddCode} variant="contained">
						Add Code
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
