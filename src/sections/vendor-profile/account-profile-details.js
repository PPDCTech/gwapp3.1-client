import { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	TextField,
	Typography,
	Unstable_Grid2 as Grid,
	Container,
	Select,
	MenuItem,
	FormControl,
	List,
	ListItem,
	ListItemText,
	Button,
	Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { changePassword } from "../../services/vendor-api-Services";
import { shortenString } from "../../utils/format-strings";

export const VendorProfileDetails = ({ vendor, isViewingOwnProfile }) => {
	const [businessDetails] = useState({
		businessName: vendor?.businessDetails?.businessName || "",
		cacRegNumber: vendor?.businessDetails?.cacRegNumber || "",
		tinNumber: vendor?.businessDetails?.tinNumber || "",
		rcNumber: vendor?.businessDetails?.rcNumber || "",
		registeredAddress: vendor?.businessDetails?.registeredAddress || "",
		physicalAddress: vendor?.businessDetails?.physicalAddress || "",
		functionalMailAddress: vendor?.businessDetails?.functionalMailAddress || "",
	});

	const [documents] = useState(vendor?.documents || []);

	const [categories] = useState(vendor?.categories || []);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		try {
			// Replace with your API endpoint
			await changePassword({ oldPassword, newPassword });
			toast.success("Password changed successfully");
		} catch (error) {
			toast.error(error.message);
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

	return (
		<Container sx={{ mt: 4 }}>
			<Card>
				<CardHeader title="Business Details" />
				<CardContent>
					<Box sx={{ m: -1.5 }}>
						<Grid container spacing={3}>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="Business Name"
									name="businessName"
									disabled
									value={businessDetails.businessName}
								/>
							</Grid>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="CAC Registration Number"
									name="cacRegNumber"
									disabled
									value={businessDetails.cacRegNumber}
								/>
							</Grid>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="TIN Number"
									name="tinNumber"
									disabled
									value={businessDetails.tinNumber}
								/>
							</Grid>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="RC Number"
									name="rcNumber"
									disabled
									value={businessDetails.rcNumber}
								/>
							</Grid>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="Registered Address"
									name="registeredAddress"
									disabled
									value={businessDetails.registeredAddress}
								/>
							</Grid>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="Physical Address"
									name="physicalAddress"
									disabled
									value={businessDetails.physicalAddress}
								/>
							</Grid>
							<Grid xs={12} md={6}>
								<TextField
									fullWidth
									label="Functional Mail Address"
									name="functionalMailAddress"
									disabled
									value={businessDetails.functionalMailAddress}
								/>
							</Grid>
						</Grid>
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
										</ListItem>
									))}
								</List>
							)}
						</Grid>
					</Box>
				</CardContent>
			</Card>

			<Card sx={{ mt: 3 }}>
				<CardHeader title="Categories" />
				<CardContent>
					<Box sx={{ m: -1.5 }}>
						<FormControl fullWidth>
							<Select
								multiple
								value={categories}
								disabled
								displayEmpty
								renderValue={(selected) => {
									if (selected.length === 0) {
										return <em>No categories</em>;
									}
									return (
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
											{selected.map((value) => (
												<Chip key={value} label={value} />
											))}
										</Box>
									);
								}}
								fullWidth
							>
								<MenuItem disabled value="">
									<em>No categories selected</em>
								</MenuItem>
								{categories.map((category, index) => (
									<MenuItem key={index} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</CardContent>
			</Card>

			{isViewingOwnProfile && (
				<Card sx={{ mt: 3 }}>
					<CardHeader title="Password Change" />
					<CardContent>
						<Box sx={{ m: -1.5 }} component="form" onSubmit={handlePasswordChange}>
							<Grid container spacing={3}>
								<Grid xs={12} md={6}>
									<TextField
										fullWidth
										label="Old Password"
										name="oldPassword"
										type="password"
										value={oldPassword}
										onChange={(e) => setOldPassword(e.target.value)}
										required
									/>
								</Grid>
								<Grid xs={12} md={6}>
									<TextField
										fullWidth
										label="New Password"
										name="newPassword"
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
								</Grid>
							</Grid>
							<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
								Change Password
							</Button>
						</Box>
					</CardContent>
				</Card>
			)}
		</Container>
	);
};
