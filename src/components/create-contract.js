import { useState } from "react";
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
	Box,
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
	const [title, setTitle] = useState(contractData?.title || "");
	const [projectCode, setProjectCode] = useState(
		contractData?.projectCode || "",
	);
	const [category, setCategory] = useState(contractData?.category || "");
	const [duration, setDuration] = useState(contractData?.duration || "");
	const [value, setValue] = useState(contractData?.value || "");
	const [currency, setCurrency] = useState(contractData?.currency || "NGN");
	const [description, setDescription] = useState(
		contractData?.description || "",
	);
	const [status, setStatus] = useState(contractData?.status || "open");

	const [loadingC, setLoadingC] = useState(false);
	const [loadingU, setLoadingU] = useState(false);

	const handleCategoryChange = (event) => {
		 console.log(event.target.value); 
			setCategory(event.target.value);
	 };
	
	const handleCreateSubmit = async () => {
		const contract = {
			title,
			projectCode,
			category,
			duration,
			value,
			currency,
			description,
			status,
		};

		try {
			setLoadingC(true);
			await newContract(contract);
			toast.success("Contract created successfully");
			setLoadingC(false);
			onClose();
			fetchContracts();
		} catch (error) {
			toast.error(error.message);
			setLoadingC(false);
		}
	};
	const handleUpdateSubmit = async () => {
		const contract = {
			title,
			projectCode,
			category,
			duration,
			value,
			currency,
			description,
			status,
		};

		setLoadingU(true);

		try {
			await updateContract(contractData._id, contract);
			toast.success("Contract updated successfully");
			setLoadingU(false);
			onClose();
			fetchContracts();
		} catch (error) {
			toast.error(error.message);
			setLoadingU(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{isEditMode ? "Edit Contract" : "Create Contract"}</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<TextField
								fullWidth
								label="Project Code or Name"
								variant="outlined"
								value={projectCode}
								onChange={(e) => setProjectCode(e.target.value)}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Title"
							variant="outlined"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								label="Category"
								value={category}
								onChange={handleCategoryChange}
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
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Value"
							type="number"
							variant="outlined"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel>Currency</InputLabel>
							<Select
								label="Currency"
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
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
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select
								label="Status"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
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
				{isEditMode && (
					<Button
						onClick={handleUpdateSubmit}
						color="success"
						disabled={loadingU}
						variant="contained"
					>
						{loadingU ? "Updating..." : "Update"}
					</Button>
				)}
				{!isEditMode && (
					<Button
						onClick={handleCreateSubmit}
						color="success"
						disabled={loadingC}
						variant="contained"
					>
						{loadingC ? "Creating..." : "Create"}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default CreateContractModal;
