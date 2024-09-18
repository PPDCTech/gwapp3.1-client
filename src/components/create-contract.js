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
	TextField,
	Grid,
	OutlinedInput,
} from "@mui/material";
import { useAuth } from "../hooks/use-auth";
import { toast } from "react-toastify";
import { newContract, updateContract } from "../services/contract-api-Services";

const categoriesData = [
	"Airlines & Travel Agents",
	"Tour Operators",
	"Hotels & Conference Halls",
	"Car Hire Services",
	"Catering Services",
	"Courier & Postage",
	"Electrical & Electronics",
	"Freight & Logistics",
	"Fumigation, Floriculture & Industrial Cleaning",
	"Furniture, Carpenters & Interior Decoration",
	"Groceries, Provisions & Supermarkets",
	"ICT: Equipment, Accessories & Software",
	"Insurance",
	"Office Equipment & Machinery",
	"Generator, Petroleum Products, Maintenance and Supply",
	"Printing, Media & Advertisement",
	"Stationery, Provisions and Consumables",
	"Vehicle hire Services",
	"Vehicle Maintenance & Accessories",
	"Cooperative Services & Professional Services",
	"Construction & Maintenance",
	"Groceries, Provisions & Supermarkets",
	"Hotels & Conference Halls",
	"Telecommunications; Internet solutions, Airtime.",
	"Solar Systems and Inverter",
	"CCTV camera systems",
	"Catering Services",
	"Security and Safety",
	"Stationary, Provisions and Consumables",
	"Cooperative Services & Professionals Services",
];

const CreateContractModal = ({
	open,
	onClose,
	isEditMode,
	contractData,
	fetchContracts,
}) => {
	const { user } = useAuth();
	const uniqueCategories = [...new Set(categoriesData)];
	// State initialization
	const [formFields, setFormFields] = useState({
		title: "",
		projectCode: "",
		category: "",
		duration: "",
		value: "",
		currency: "NGN",
		description: "",
		status: "open",
	});

	const [loading, setLoading] = useState(false);

	// Effect to populate fields in edit mode
	useEffect(() => {
		if (isEditMode && contractData) {
			setFormFields({
				title: contractData.title || "",
				projectCode: contractData.projectCode || "",
				category: contractData.category || "",
				duration: contractData.duration || "",
				value: contractData.value || "",
				currency: contractData.currency || "NGN",
				description: contractData.description || "",
				status: contractData.status || "open",
			});
		}
	}, [isEditMode, contractData]);

	// Handle input change
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};

	// Create or Update contract
	const handleSubmit = async () => {
		setLoading(true);
		try {
			if (isEditMode) {
				await updateContract(contractData._id, formFields);
				toast.success("Contract updated successfully");
			} else {
				await newContract(formFields);
				toast.success("Contract created successfully");
			}
			fetchContracts();
			onClose();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{isEditMode ? "Edit Contract" : "Create Contract"}</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Project Code or Name"
							variant="outlined"
							name="projectCode"
							value={formFields.projectCode}
							onChange={handleInputChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Title"
							variant="outlined"
							name="title"
							value={formFields.title}
							onChange={handleInputChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								label="Category"
								name="category"
								value={formFields.category}
								onChange={handleInputChange}
								input={<OutlinedInput label="Category" />}
							>
								{uniqueCategories.map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Duration"
							variant="outlined"
							name="duration"
							value={formFields.duration}
							onChange={handleInputChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Value"
							type="number"
							variant="outlined"
							name="value"
							value={formFields.value}
							onChange={handleInputChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel>Currency</InputLabel>
							<Select
								label="Currency"
								name="currency"
								value={formFields.currency}
								onChange={handleInputChange}
							>
								<MenuItem value="NGN">NGN</MenuItem>
								<MenuItem value="USD">USD</MenuItem>
								<MenuItem value="EUR">EUR</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Description"
							variant="outlined"
							multiline
							rows={4}
							name="description"
							value={formFields.description}
							onChange={handleInputChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select
								label="Status"
								name="status"
								value={formFields.status}
								onChange={handleInputChange}
							>
								<MenuItem value="open">Open</MenuItem>
								<MenuItem value="closed">Closed</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error">
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color="success"
					disabled={loading}
					variant="contained"
				>
					{loading
						? isEditMode
							? "Updating..."
							: "Creating..."
						: isEditMode
						? "Update"
						: "Create"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateContractModal;
