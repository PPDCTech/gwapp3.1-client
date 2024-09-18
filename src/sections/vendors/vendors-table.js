import { useState, useEffect, useCallback } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Card,
	Box,
	Grid,
	Button,
	Typography,
	Divider,
	TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchSingleUser } from "../../services/api/users.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { indigo } from "../../theme/colors";
import { useAuth } from "../../hooks/use-auth";
import { DocumentIcon } from "@heroicons/react/24/outline";
import {
	adminChangeStatus,
	adminDeleteVendor,
} from "../../services/vendor-api-Services";
import { shortenString } from "../../utils/format-strings";
import AlertModal from "../../components/alert-modal";

export const VendorsTable = ({
	title,
	vendors,
	loading,
	currentPage,
	fetchVendors,
	setKeyword,
	totalPages,
	handlePreviousPage,
	handleNextPage,
}) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const [user, setUser] = useState(auth?.user);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [vendorId, setVendorId] = useState("");

	const fetchUserData = useCallback(async () => {
		try {
			const userId = window.localStorage.getItem("gwapp_userId");
			if (userId) {
				const response = await fetchSingleUser(userId);
				setUser(response?.data);
				auth.fetchUserData();
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}, [auth]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const handleSearchChange = (e) => {
		setKeyword(e.target.value);
		fetchVendors();
	};

	const [expanded, setExpanded] = useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
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

	const handleStatusChange = async (vendorId, status) => {
		const form = {
			vendorId,
			status,
		};
		try {
			await adminChangeStatus(form);
			toast.success("Status updated successfully");
			fetchVendors();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleDelete = async () => {
		try {
			await adminDeleteVendor(vendorId);
			toast.success("Vendor deleted successfully");
			fetchVendors();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const openDeleteModal = (contractId) => {
		setVendorId(contractId);
		setDeleteModalOpen(true);
	};

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<>
			{vendors && vendors.length > 0 ? (
				<Card sx={{ p: 2 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography sx={{ my: 3 }} variant="h6">
							{title}
						</Typography>

						{/* Search input */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<TextField
								type="text"
								placeholder="Enter keyword to search"
								onChange={handleSearchChange}
								variant="outlined"
								size="small"
								InputProps={{
									sx: {
										"&::placeholder": {
											transition: "opacity 0.3s ease-in-out",
											opacity: 0.5,
										},
										"&:focus::placeholder": {
											opacity: 1,
										},
									},
								}}
							/>
						</Box>
					</Box>

					{vendors.map((vendor, index) => (
						<Accordion
							expanded={expanded === `panel${index + 1}`}
							onChange={handleChange(`panel${index + 1}`)}
							key={index}
							sx={{ borderTop: "0.5px solid #83c5be" }}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={`panel${index + 1}bh-content`}
								id={`panel${index + 1}bh-header`}
							>
								<Typography
									component={"span"}
									sx={{
										width: "33%",
										flexShrink: 0,
										borderLeft:
											expanded === `panel${index + 1}` ? "5px solid #83c5be" : "none",
										paddingLeft: expanded === `panel${index + 1}` ? "5px" : "initial",
									}}
								>
									{shortenString(vendor?.businessDetails?.businessName, 70) || "..."}
								</Typography>
								<Typography component={"span"} sx={{ color: "text.secondary" }}>
									<strong>RC Number: </strong>{" "}
									{vendor?.businessDetails?.rcNumber ?? "N/A"}
								</Typography>
							</AccordionSummary>
							<AccordionDetails sx={{ bgcolor: "#f5f5f5" }}>
								<Box sx={{ flexGrow: 1 }}>
									<Grid container spacing={2}>
										{/* Account Details */}
										<Grid item xs={12}>
											<Typography variant="h6">Account Details</Typography>
											<Divider sx={{ mb: 2 }} />
											<Grid container spacing={2}>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Bank Name
													</Typography>
													<Typography variant="body1">
														{vendor?.accountDetails?.bankName || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Account Number
													</Typography>
													<Typography variant="body1">
														{vendor?.accountDetails?.number || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Account Holder Name
													</Typography>
													<Typography variant="body1">
														{vendor?.accountDetails?.holderName || "N/A"}
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										{/* Documents */}
										<Grid item xs={12}>
											<Typography variant="h6">Documents</Typography>
											<Divider sx={{ mb: 2 }} />
											{
												// Display message if no documents uploaded
												vendor?.documents?.length === 0 && (
													<Typography variant="body2" color="textSecondary">
														No documents uploaded
													</Typography>
												)
											}
											{vendor?.documents?.map((document, index) => (
												<Grid item key={index}>
													{isImage(document.url) ? (
														<div style={{ display: "flex", flexDirection: "column" }}>
															<img
																src={document.url}
																alt={document.name}
																style={{
																	width: "100px",
																	height: "100px",
																	cursor: "pointer",
																}}
																onClick={() => window.open(document.url, "_blank")}
															/>
															<Typography variant="caption">{document.name}</Typography>
														</div>
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
															<Typography variant="caption">{document.name}</Typography>
														</div>
													)}
												</Grid>
											))}
										</Grid>

										{/* Contact Person */}
										<Grid item xs={12}>
											<Typography variant="h6">Contact Person</Typography>
											<Divider sx={{ mb: 2 }} />
											<Grid container spacing={2}>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Name
													</Typography>
													<Typography variant="body1">
														{vendor?.contactPerson?.name || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Phone Number
													</Typography>
													<Typography variant="body1">
														{vendor?.contactPerson?.phoneNumber || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Email
													</Typography>
													<Typography variant="body1">
														{vendor?.contactPerson?.email || "N/A"}
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										{/* Business Details */}
										<Grid item xs={12}>
											<Typography variant="h6">Business Details</Typography>
											<Divider sx={{ mb: 2 }} />
											<Grid container spacing={2}>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														CAC Registration Number
													</Typography>
													<Typography variant="body1">
														{vendor?.businessDetails?.cacRegNumber || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														TIN Number
													</Typography>
													<Typography variant="body1">
														{vendor?.businessDetails?.tinNumber || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Registered Address
													</Typography>
													<Typography variant="body1">
														{vendor?.businessDetails?.registeredAddress || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Functional Mail Address
													</Typography>
													<Typography variant="body1">
														{vendor?.businessDetails?.functionalMailAddress || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Physical Address
													</Typography>
													<Typography variant="body1">
														{vendor?.businessDetails?.physicalAddress || "N/A"}
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										{/* Status */}
										<Grid item xs={12}>
											<Typography variant="h6">Status</Typography>
											<Divider sx={{ mb: 2 }} />
											<Typography
												variant="body2"
												sx={{ marginTop: "2px", marginBottom: "auto" }}
												color={
													vendor?.status === "verified"
														? "green"
														: vendor?.status === "rejected"
														? "red"
														: "orange"
												}
											>
												{vendor?.status?.toUpperCase() || "N/A"}
											</Typography>{" "}
										</Grid>

										{/* Categories */}
										<Grid item xs={12}>
											<Typography variant="h6">Categories</Typography>
											<Divider sx={{ mb: 2 }} />
											<Typography variant="body1">
												{vendor?.categories?.join(", ") || "N/A"}
											</Typography>
										</Grid>
									</Grid>
									<Box
										sx={{
											display: "flex",
											justifyContent: "end",
										}}
									>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Button
												onClick={() => navigate(`/vendor/${vendor._id}/profile`)}
												color="primary"
											>
												View Profile
											</Button>
											{user?.position?.some((role) =>
												[
													"tech",
													"userManager",
													"finance",
													"financeReviewer",
													"superUser",
												].includes(role),
											) && (
												<Button
													onClick={() => handleStatusChange(vendor._id, "verified")}
													color="success"
												>
													Mark as verified
												</Button>
											)}
											{user?.position?.some((role) =>
												[
													"tech",
													"userManager",
													"finance",
													"financeReviewer",
													"superUser",
												].includes(role),
											) && (
												<Button
													onClick={() => handleStatusChange(vendor._id, "rejected")}
													color="warning"
												>
													Mark as rejected
												</Button>
											)}
											{user?.position?.some((role) =>
												[
													"tech",
													"userManager",
													"finance",
													"financeReviewer",
													"superUser",
												].includes(role),
											) && (
												<Button onClick={() => openDeleteModal(vendor._id)} color="error">
													Delete
												</Button>
											)}
										</Box>
									</Box>
								</Box>
							</AccordionDetails>
						</Accordion>
					))}

					{/* Paginate  when vendors are more than 10 */}
					{totalPages > 1 && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								mt: 3,
							}}
						>
							<Button
								variant="contained"
								color="primary"
								onClick={handlePreviousPage}
								disabled={currentPage === 1}
							>
								Previous
							</Button>
							<Box sx={{ mx: 2 }}>
								<Typography variant="body1">
									{currentPage} of {totalPages}
								</Typography>
							</Box>
							<Button
								variant="contained"
								color="primary"
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
							>
								Next
							</Button>
						</Box>
					)}
				</Card>
			) : (
				<Typography sx={{ mt: 2 }}>No Vendors found.</Typography>
			)}

			<AlertModal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Delete Vendor"
				content="Are you sure you want to delete this vendor?"
				onConfirm={handleDelete}
			/>
		</>
	);
};
