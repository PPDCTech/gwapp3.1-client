import React, { useState, useEffect, useCallback } from "react";
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
	List,
	ListItem,
	ListItemText,
	IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/use-auth";
import { useParams } from "react-router-dom";
import { removeFile, updateProfile, viewAVendor } from "../services/vendor-api-Services";
import { shortenString } from "../utils/format-strings";
 
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

const EditProfile = () => {
	const { vendorId } = useParams();
	const { user } = useAuth();
	const uniqueCategories = [...new Set(categoriesData)];

	const userId = vendorId ? vendorId : user._id;

	const [submittingAccountDetails, setSubmittingAccountDetails] =
		useState(false);
	const [submittingContactPerson, setSubmittingContactPerson] = useState(false);
	const [submittingBusinessDetails, setSubmittingBusinessDetails] =
		useState(false);
	const [submittingCategories, setSubmittingCategories] = useState(false);
	const [submittingFiles, setSubmittingFiles] = useState(false);

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

	const [documents, setDocuments] = useState([]);

	const [categories, setCategories] = useState([]);

	const [files, setFiles] = useState([]);
	const [documentNames, setDocumentNames] = useState([]);

	// Fetch vendor data and populate state
		const fetchVendorData = useCallback(async () => {
			try {
				const response = await viewAVendor(userId);
				const vendor = response.data;
				setAccountDetails(vendor?.accountDetails);
				setContactPerson(vendor?.contactPerson);
				setBusinessDetails(vendor?.businessDetails);
				setCategories(vendor?.categories);
				setDocuments(vendor?.documents);
			} catch (error) {
				console.error("Failed to fetch vendor data:", error);
			}
		}, [userId]);

	useEffect(() => {
		fetchVendorData();
	}, [fetchVendorData]);

	const handleAccountDetailsChange = (e) => {
		setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
	};

	const handleContactPersonChange = (e) => {
		setContactPerson({ ...contactPerson, [e.target.name]: e.target.value });
	};

	const handleBusinessDetailsChange = (e) => {
		setBusinessDetails({ ...businessDetails, [e.target.name]: e.target.value });
	};

	const handleAccountDetailsSubmit = async (e) => {
		e.preventDefault();
		setSubmittingAccountDetails(true);
		try {
			await updateProfile(userId, { accountDetails });
			setSubmittingAccountDetails(false);
			fetchVendorData();
			toast.success("Account details updated successfully.");
		} catch (error) {
			toast.error(error.message);
			setSubmittingAccountDetails(false);
		}
	};

	const handleContactPersonSubmit = async (e) => {
		e.preventDefault();
		setSubmittingContactPerson(true);
		try {
			await updateProfile(userId, { contactPerson });
			setSubmittingContactPerson(false);
			fetchVendorData();
			toast.success("Contact person updated successfully.");
		} catch (error) {
			toast.error(error.message);
			setSubmittingContactPerson(false);
		}
	};

	const handleBusinessDetailsSubmit = async (e) => {
		e.preventDefault();
		setSubmittingBusinessDetails(true);
		try {
			await updateProfile(userId, { businessDetails });
			setSubmittingBusinessDetails(false);
			fetchVendorData();
			toast.success("Business details updated successfully.");
		} catch (error) {
			toast.error(error.message);
			setSubmittingBusinessDetails(false);
		}
	};

	const handleCategoriesSubmit = async (e) => {
		e.preventDefault();
		setSubmittingCategories(true);
		try {
			await updateProfile(userId, { categories });
			setSubmittingCategories(false);
			fetchVendorData();
			toast.success("Categories updated successfully.");
		} catch (error) {
			toast.error(error.message);
			setSubmittingCategories(false);
		}
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
	const handleFileUploadSubmit = async (event) => {
		event.preventDefault();
		setSubmittingFiles(true);

		// validate and ensure that files and documentNames arrays are not empty
		if (files.length === 0 || documentNames.length === 0) {
			toast.error("Please select files and provide corresponding document names.");
			setSubmittingFiles(false);
			return;
		}

		const formData = new FormData();

		// Append files and their corresponding document names
		files.forEach((file, index) => {
			formData.append("files", file); // append each file
			formData.append("documentNames[]", documentNames[index]); // append each corresponding document name
		});

		try {
			// Call the API to upload files and form data
			await updateProfile(userId, formData);
			setSubmittingFiles(false);
			fetchVendorData();
			toast.success("Files uploaded successfully.");
		} catch (error) {
			toast.error(error.message);
			setSubmittingFiles(false);
		}
	};


	const isImage = (url) => {
		const imageExtensions = ["jpg", "jpeg", "png", "gif"];
		const extension = url.split(".").pop().toLowerCase();
		return imageExtensions.includes(extension);
	};

	const downloadFile = (url, name) => {
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", name);

				// Append the anchor element to the body
				document.body.appendChild(link);

				// Programmatically click the anchor to trigger the download
				link.click();

				// Clean up: remove the anchor from the DOM
				document.body.removeChild(link);
				URL.revokeObjectURL(link.href); // Revoke the object URL to free up memory
			})
			.catch((error) => console.error("Error downloading file:", error));
	};

	const handleDelete = async (doc) => {
		try {
			await removeFile(doc)
			fetchVendorData();
			toast.success("Document deleted successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};


	return (
		<Container >
			<Typography variant="h4" gutterBottom>
				Update Profile
			</Typography>

			{/* Contact Person Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Contact Person" />
				<CardContent>
					<Box component="form" onSubmit={handleContactPersonSubmit}>
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
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
							disabled={submittingContactPerson}
						>
							{submittingContactPerson ? "Updating..." : "Update Contact Person"}
						</Button>
					</Box>
				</CardContent>
			</Card>
			{/* Account Details Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Account Details" />
				<CardContent>
					<Box component="form" onSubmit={handleAccountDetailsSubmit}>
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
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
							disabled={submittingAccountDetails}
						>
							{submittingAccountDetails ? "Updating..." : "Update Account Details"}
						</Button>
					</Box>
				</CardContent>
			</Card>

			{/* Business Details Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Business Details" />
				<CardContent>
					<Box component="form" onSubmit={handleBusinessDetailsSubmit}>
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
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
							disabled={submittingBusinessDetails}
						>
							{submittingBusinessDetails ? "Updating..." : "Update Business Details"}
						</Button>
					</Box>
				</CardContent>
			</Card>

			{/* Categories Card */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Categories" />
				<CardContent>
					<Box component="form" onSubmit={handleCategoriesSubmit}>
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

						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
							disabled={submittingCategories}
						>
							{submittingCategories ? "Updating..." : "Update Categories"}
						</Button>
					</Box>
				</CardContent>
			</Card>

			<Card sx={{ mt: 3 }}>
				<CardHeader title="Documents" />
				<CardContent>
					<Box sx={{ m: -1.5 }}>
						<Grid item xs={12}>
							{documents.length === 0 ? (
								<Typography variant="body2" color="textSecondary">
									No documents uploaded
								</Typography>
							) : (
								<List>
									{documents.map((document, index) => (
										<ListItem key={index} sx={{ display: "flex", alignItems: "center" }}>
											{isImage(document.url) ? (
												<img
													src={document.url}
													alt={document.name}
													style={{
														width: "100px",
														height: "100px",
														cursor: "pointer",
														marginRight: "16px",
													}}
													onClick={() => window.open(document.url, "_blank")}
												/>
											) : (
												<div
													style={{
														width: "fit-content",
														height: "fit-content",
														padding: "5px",
														backgroundColor: "#E5E7EB",
														textAlign: "center",
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
														alignItems: "center",
														cursor: "pointer",
														borderRadius: "5px",
														transition: "background-color 0.3s ease",
														marginRight: "16px",
													}}
													onClick={() => {
														if (
															document.name.endsWith(".xlsx") ||
															document.name.endsWith(".csv")
														) {
															downloadFile(document.url, document.name);
														} else {
															window.open(document.url, "_blank");
														}
													}}
													onMouseEnter={(e) =>
														(e.currentTarget.style.backgroundColor = "#D2D6DB")
													}
													onMouseLeave={(e) =>
														(e.currentTarget.style.backgroundColor = "#E5E7EB")
													}
												>
													<DocumentIcon
														style={{
															height: 24,
															width: 24,
														}}
													/>
													<Typography variant="caption">
														{shortenString(document.name, 50)}
													</Typography>
												</div>
											)}
											<ListItemText primary={shortenString(document.name, 50)} />
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => handleDelete(document)}
											>
												<DeleteIcon />
											</IconButton>
										</ListItem>
									))}
								</List>
							)}
						</Grid>
					</Box>
				</CardContent>
			</Card>

			{/* Multiple File Upload Card with dynamic fields  for the name of the document */}
			<Card sx={{ mt: 3, mb: 4 }}>
				<CardHeader title="Upload Files (e.g. Certificates, Licenses, Registrations, TIN)" />
				<CardContent>
					<Box component="form" onSubmit={handleFileUploadSubmit}>
						{/* File Input only pdf and image files */}
						<input
							type="file"
							accept=".pdf, .jpg, .jpeg, .png"
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

						{/* Submit Button */}
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
							disabled={submittingFiles}
						>
							{submittingFiles ? "Uploading..." : "Upload Files"}
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
};

export default EditProfile;
