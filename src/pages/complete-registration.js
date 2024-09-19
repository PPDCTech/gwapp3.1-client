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
	Modal,
	IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { viewAVendor, updateProfile } from "../services/vendor-api-Services";
import DeleteIcon from "@mui/icons-material/Delete";

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
	const navigate = useNavigate();
	const uniqueCategories = [...new Set(categoriesData)];
	const [vendorId, setVendorId] = useState("");

	useEffect(() => {
		// search if vendor = true set method to vendor
		const urlSearchParams = new URLSearchParams(window.location.search);
		const vendor_id = urlSearchParams.get("vendorId");
		if (vendor_id) {
			setVendorId(vendor_id);
		}
	}, []);

	const [step, setStep] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);

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
		const fetchVendorData = async () => {
			try {
				const response = await viewAVendor(vendorId);
				const vendor = response.data;
				setAccountDetails(vendor?.accountDetails);
				setContactPerson(vendor?.contactPerson);
				setBusinessDetails(vendor?.businessDetails);
				setCategories(vendor?.categories);
			} catch (error) {
				toast.error("Failed to fetch vendor data.");
			}
		};

		if (vendorId) {
			fetchVendorData();
		}
	}, [vendorId]);

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

	const handleFileChange = (event) => {
		const newFiles = Array.from(event.target.files);
		setFiles([...files, ...newFiles]);
		setDocumentNames([...documentNames, ...newFiles.map(() => "")]);
	};

	const handleDocumentNameChange = (index, event) => {
		const updatedNames = [...documentNames];
		updatedNames[index] = event.target.value;
		setDocumentNames(updatedNames);
	};

	const handleRemoveFile = (index) => {
		const updatedFiles = [...files];
		updatedFiles.splice(index, 1);

		const updatedNames = [...documentNames];
		updatedNames.splice(index, 1);

		setFiles(updatedFiles);
		setDocumentNames(updatedNames);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitting(true);

		const formData = new FormData();

		files.forEach((file, index) => {
			formData.append("files", file);
			formData.append("documentNames[]", documentNames[index]);
		});

		formData.append("categories", categories);
		formData.append("accountDetails", JSON.stringify(accountDetails));
		formData.append("contactPerson", JSON.stringify(contactPerson));
		formData.append("businessDetails", JSON.stringify(businessDetails));

		try {
			await updateProfile(vendorId, formData);
			setSubmitting(false);
			setModalOpen(true); // Open the modal on successful submit
		} catch (error) {
			toast.error("Failed to update profile.");
			setSubmitting(false);
		}
	};

	const goToLogin = () => {
		setModalOpen(false);
		navigate("/user/login?vendor=true");
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<Card>
						<CardHeader title="Contact Person" />
						<CardContent>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<TextField
										label="Name"
										name="name"
										value={contactPerson.name}
										onChange={handleContactPersonChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										label="Email"
										name="email"
										value={contactPerson.email}
										onChange={handleContactPersonChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										label="Phone Number"
										name="phoneNumber"
										value={contactPerson.phoneNumber}
										onChange={handleContactPersonChange}
										fullWidth
										required
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				);
			case 2:
				return (
					<Card>
						<CardHeader title="Account Details" />
						<CardContent>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<TextField
										label="Holder Name"
										name="holderName"
										value={accountDetails.holderName}
										onChange={handleAccountDetailsChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										label="Account Number"
										name="number"
										value={accountDetails.number}
										onChange={handleAccountDetailsChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										label="Bank Name"
										name="bankName"
										value={accountDetails.bankName}
										onChange={handleAccountDetailsChange}
										fullWidth
										required
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				);
			case 3:
				return (
					<Card>
						<CardHeader title="Business Details" />
						<CardContent>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<TextField
										label="Business Name"
										name="businessName"
										value={businessDetails.businessName}
										onChange={handleBusinessDetailsChange}
										fullWidth
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
						</CardContent>
					</Card>
				);
			case 4:
				return (
					<Card>
						<CardHeader title="Categories" />
						<CardContent>
							<Select
								multiple
								value={categories}
								onChange={handleCategoriesChange}
								input={<OutlinedInput />}
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
						</CardContent>
					</Card>
				);
			case 5:
				return (
					<Card>
						<CardHeader title="File Upload" />
						<CardContent>
							<input type="file" multiple onChange={handleFileChange} />
							{files.map((file, index) => (
								<Box key={index} sx={{ display: "flex", alignItems: "center" }}>
									<TextField
										label="Document Name"
										value={documentNames[index]}
										onChange={(e) => handleDocumentNameChange(index, e)}
									/>
									<IconButton onClick={() => handleRemoveFile(index)}>
										<DeleteIcon />
									</IconButton>
								</Box>
							))}
						</CardContent>
					</Card>
				);
			default:
				return null;
		}
	};

	return (
		<Container sx={{ my: 4, px: 5 }}>
			<Typography variant="h4" gutterBottom>
				Complete Registration
			</Typography>

			{renderStep()}

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button
					variant="contained"
					onClick={() => setStep(step - 1)}
					disabled={step === 1}
				>
					Back
				</Button>
				{step === 5 ? (
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						disabled={submitting}
					>
						{submitting ? "Submitting..." : "Submit"}
					</Button>
				) : (
					<Button
						variant="contained"
						color="primary"
						onClick={() => setStep(step + 1)}
					>
						Next
					</Button>
				)}
			</Box>
			<Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
				<Card sx={{ p: 3, mx: "auto", my: 5, maxWidth: 400 }}>
					<CardContent>
						<Typography variant="h5" gutterBottom>
							Profile Completed!
						</Typography>
						<Button variant="contained" color="primary" onClick={goToLogin}>
							Go to Login
						</Button>
					</CardContent>
				</Card>
			</Modal>
		</Container>
	);
};

export default CompleteRegistration;
