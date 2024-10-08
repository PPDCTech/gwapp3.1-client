import { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { indigo } from "../../theme/colors";

export const AddBudgetCodeModal = ({ onAddNew, user }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [codeValue, setCodeValue] = useState("");
	const [project, setProject] = useState("");
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
			code: codeValue,
			project,
			description,
		};
		onAddNew(new_code);
		handleClose();
	};

	return (
		<>
			{user?.position?.some((role) =>
				["tech", "finance", "financeReviewer"].includes(role),
			) ? (
				<Button variant="outlined" sx={{ color: indigo.main }} onClick={handleOpen}>
					Add New Code
				</Button>
			) : null}

			<Dialog open={isOpen} onClose={handleClose}>
				<DialogTitle>New Budget Code</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Code Value"
						value={codeValue}
						onChange={(e) => setCodeValue(e.target.value)}
						variant="outlined"
						sx={{ my: 2 }}
					/>
					<TextField
						fullWidth
						label="Project"
						value={project}
						onChange={(e) => setProject(e.target.value)}
						variant="outlined"
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						variant="outlined"
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
