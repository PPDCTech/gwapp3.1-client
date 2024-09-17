import { useState, useEffect } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { awardContract } from "../services/contract-api-Services";

const AwardContractModal = ({
	open,
	onClose,
	contractData,
	fetchContracts,
}) => {
	const [contractors, setContractors] = useState([]);
	const [selectedContractor, setSelectedContractor] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
			setContractors(contractData?.applicants || []);
		
	}, [contractData]);

	const handleAwardSubmit = async () => {
		const payload = {
			vendorId: selectedContractor._id,
		};

		try {
			setLoading(true);
			await awardContract(contractData?._id, payload);
			toast.success("Contract awarded successfully");
			setLoading(false);
			onClose();
			fetchContracts();
		} catch (error) {
			toast.error(error.message);
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>Award Contract</DialogTitle>
			<DialogContent>
				<Typography>{`Award Contract ${contractData?.title} to vendor:`}</Typography>
				<FormControl fullWidth margin="normal">
					<InputLabel>Select Contractor</InputLabel>
					<Select
						value={selectedContractor._id || ""}
						onChange={(e) => {
							const contractor = contractors.find(
								(contractor) => contractor._id === e.target.value,
							);
							setSelectedContractor(contractor);
						}}
					>
						{contractors.map((contractor) => (
							<MenuItem key={contractor._id} value={contractor._id}>
								{contractor.businessDetails?.businessName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error">
					Cancel
				</Button>
				<Button
					onClick={handleAwardSubmit}
					color="success"
					disabled={loading}
					variant="contained"
				>
					{loading ? "Updating..." : "Award"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AwardContractModal;
