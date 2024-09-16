import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Container,
	Grid,
	TextField,
	Typography,
	Chip,
	Select,
	MenuItem,
	OutlinedInput,
	IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { updateProfile, viewAVendor } from "../services/vendor-api-Services";

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

const CompleteRegistration = () => {
	const { vendorId } = useParams();
	const navigate = useNavigate();
	const uniqueCategories = [...new Set(categoriesData)];

	useEffect(() => {
		// reload the page on mount to fetch the vendor data
		window.location.reload();
	}, []);

	const userId = vendorId;

	const [submitting, setSubmitting] = useState(false);

	const [accountDetails, setAccountDetails] = useState({
		holderName: "",
		number: "",
		bankName: "",
	});

	const [contactPerson, setContactPerson] = useState({
		name: "",
		email: "",
		phoneNumber: "",
	});

	const [businessDetails, setBusinessDetails] = useState({
		businessName: "",
		cacRegNumber: "",
		tinNumber: "",
		rcNumber: "",
		registeredAddress: "",
		physicalAddress: "",
		functionalMailAddress: "",
	});

	const [categories, setCategories] = useState([]);

	const [files, setFiles] = useState([]);
	const [documentNames, setDocumentNames] = useState([]);

	useEffect(() => {
		// Fetch vendor data and populate state
		const fetchVendorData = async () => {
			try {
				const response = await viewAVendor(userId);
				const vendor = response.data;
				setAccountDetails(vendor?.accountDetails);
				setContactPerson(vendor?.contactPerson);
				setBusinessDetails(vendor?.businessDetails);
				setCategories(vendor?.categories);
			} catch (error) {
				toast.error("Failed to fetch vendor data.");
				console.error("Failed to fetch vendor data:", error);
			}
		};

		fetchVendorData();
	}, [userId]);

	const handleAccountDetailsChange = (e) => {
		setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
	};

	const handleContactPersonChange = (e) => {
		setContactPerson({ ...contactPerson, [e.target.name]: e.target.value });
	};

	const handleBusinessDetailsChange = (e) => {
		setBusinessDetails({ ...businessDetails, [e.target.name]: e.target.value });
	};

	const handleCategoriesChange = (e) => {
		const { value } = e.target;
		setCategories(typeof value === "string" ? value.split(",") : value);
	};

	// Handle file input changes
	const handleFileChange = (event) => {
		const newFiles = Array.from(event.target.files);
		setFiles([...files, ...newFiles]);
		setDocumentNames([...documentNames, ...newFiles.map(() => "")]); // Initialize empty names for new files
	};

	// Handle document name change
	const handleDocumentNameChange = (index, event) => {
		const updatedNames = [...documentNames];
		updatedNames[index] = event.target.value;
		setDocumentNames(updatedNames);
	};

	// Handle file removal
	const handleRemoveFile = (index) => {
		const updatedFiles = [...files];
		updatedFiles.splice(index, 1);

		const updatedNames = [...documentNames];
		updatedNames.splice(index, 1);

		setFiles(updatedFiles);
		setDocumentNames(updatedNames);
	};

	// Handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitting(true);

		// Ensure that files and documentNames arrays have the same length
		if (files.length !== documentNames.length) {
			toast.error("The number of files must match the number of document names.");
			setSubmitting(false);
			return;
		}

		const formData = new FormData();

		// Append files and their corresponding document names
		files.forEach((file, index) => {
			formData.append("files", file); // append each file
			formData.append("documentNames[]", documentNames[index]); // append each corresponding document name
		});

		formData.append("categories", categories);
		formData.append("accountDetails", JSON.stringify(accountDetails));
		formData.append("contactPerson", JSON.stringify(contactPerson));
		formData.append("businessDetails", JSON.stringify(businessDetails));

		try {
			// Call the API to upload files and form data
			await updateProfile(userId, formData);
			setSubmitting(false);
			toast.success("Profile updated successfully");
			navigate("/user/login?vendor=true");
		} catch (error) {
			toast.error("Failed to update profile.");
			console.error("Failed to update profile:", error);
			setSubmitting(false);
		}
	};

	return (
		<Container sx={{ my: 4, px: 5, mx: "auto" }}>
			<Typography variant="h4" gutterBottom>
				Complete Registration
			</Typography>
			<Typography variant="body2" gutterBottom sx={{ my: 3 }}>
				Wellcome {contactPerson?.name} to the registration page. Please complete
				your registration by filling the form below.
			</Typography>

			{/* Contact Person Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Contact Person" />
				<CardContent>
					<Box>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<TextField
									label="Name"
									name="name"
									value={contactPerson?.name}
									onChange={handleContactPersonChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Email"
									name="email"
									type="email"
									value={contactPerson?.email}
									onChange={handleContactPersonChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Phone Number"
									name="phoneNumber"
									type="tel"
									value={contactPerson?.phoneNumber}
									onChange={handleContactPersonChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
						</Grid>
					</Box>
				</CardContent>
			</Card>
			{/* Account Details Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Account Details" />
				<CardContent>
					<Box>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<TextField
									label="Holder Name"
									name="holderName"
									value={accountDetails?.holderName}
									onChange={handleAccountDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Account Number"
									name="number"
									value={accountDetails?.number}
									onChange={handleAccountDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Bank Name"
									name="bankName"
									value={accountDetails?.bankName}
									onChange={handleAccountDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
						</Grid>
					</Box>
				</CardContent>
			</Card>

			{/* Business Details Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Business Details" />
				<CardContent>
					<Box>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<TextField
									label="Business Name"
									name="businessName"
									value={businessDetails?.businessName}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="CAC Registration Number"
									name="cacRegNumber"
									value={businessDetails?.cacRegNumber}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="TIN Number"
									name="tinNumber"
									value={businessDetails?.tinNumber}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="RC Number"
									name="rcNumber"
									value={businessDetails?.rcNumber}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Registered Address"
									name="registeredAddress"
									value={businessDetails?.registeredAddress}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Physical Address"
									name="physicalAddress"
									value={businessDetails?.physicalAddress}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Functional Mail Address"
									name="functionalMailAddress"
									value={businessDetails?.functionalMailAddress}
									onChange={handleBusinessDetailsChange}
									fullWidth
									margin="normal"
									required
								/>
							</Grid>
						</Grid>
					</Box>
				</CardContent>
			</Card>

			{/* Categories Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Categories" />
				<CardContent>
					<Box>
						<Select
							label="Categories"
							multiple
							value={categories}
							onChange={handleCategoriesChange}
							input={<OutlinedInput label="Categories" />}
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
							fullWidth
						>
							{uniqueCategories.map((category) => (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							))}
						</Select>
					</Box>
				</CardContent>
			</Card>

			{/* Multiple File Upload Card with dynamic fields  for the name of the document */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Upload Files (e.g. Certificates, Licenses, Registrations, TIN)" />
				<CardContent>
					<Box>
						{/* File Input */}
						<input
							type="file"
							multiple
							onChange={handleFileChange}
							style={{ marginBottom: "16px" }}
						/>

						{/* Dynamic Fields for Document Names */}
						{files.map((file, index) => (
							<Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
								<TextField
									label={`Document Name for ${file.name}`}
									value={documentNames[index]}
									onChange={(e) => handleDocumentNameChange(index, e)}
									fullWidth
									required
								/>
								<IconButton onClick={() => handleRemoveFile(index)} sx={{ ml: 2 }}>
									<DeleteIcon />
								</IconButton>
							</Box>
						))}
					</Box>
				</CardContent>
			</Card>

			{/* Submit Button */}
			<Box sx={{ mt: 3 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					disabled={submitting}
				>
					{submitting ? "Submitting..." : "Submit"}
				</Button>
			</Box>
		</Container>
	);
};

export default CompleteRegistration;
