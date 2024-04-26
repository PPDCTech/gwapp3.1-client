import { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Autocomplete,
} from "@mui/material";
import { bankCodes } from "../../services/bankCodes";
import { toast } from "react-toastify";
import { addAccount } from "../../services/api/accounts.api";

export const AddAccount = ({ updateAccounts }) => {
	const [open, setOpen] = useState(false);
	const [bankName, setBankName] = useState("");
	const [accountName, setAccountName] = useState("");
	const [accountNumber, setAccountNumber] = useState("");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddAccount = async () => {
		try {
			const new_account = { bankName, accountName, accountNumber };
			const response = await addAccount(new_account);
			if (response.status === 201) {
				toast.success("Account added successfully");
				if (response.status === 201) {
					setBankName("");
					setAccountName("");
					setAccountNumber("");
					setOpen(false);
					updateAccounts();
				}
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleBankNameChange = (event) => {
		setBankName(event.target.value);
	};

	return (
		<>
			<Button color="info" size="small" variant="outlined" onClick={handleOpen}>
				Add New Bank Account
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add New Account</DialogTitle>
				<DialogContent>
					<Autocomplete
						options={bankCodes.map((bank) => bank.bankName)}
						renderInput={(params) => (
							<TextField
								{...params}
								name="bankName"
								label="Bank Name"
								value={bankName}
								onSelect={(e) => setBankName(e.target.value)}
								fullWidth
								required
								sx={{ marginBottom: "1rem" }}
							/>
						)}
						onInputChange={handleBankNameChange}
					/>
					<TextField
						fullWidth
						label="Account Name"
						value={accountName}
						onChange={(e) => setAccountName(e.target.value)}
					/>
					<TextField
						sx={{ mt: 2 }}
						fullWidth
						label="Account Number"
						value={accountNumber}
						onChange={(e) => setAccountNumber(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={handleClose}>
						Cancel
					</Button>
					<Button color="success" onClick={handleAddAccount}>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
