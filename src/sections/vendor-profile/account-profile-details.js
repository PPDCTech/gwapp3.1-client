import { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	TextField,
	Typography,
	Grid,
	Container,
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
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const businessDetails = vendor?.businessDetails || {};
	const documents = vendor?.documents || [];
	const categories = vendor?.categories || [];

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		try {
			await changePassword({ oldPassword, newPassword });
			toast.success("Password changed successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const isImage = (url) =>
		["jpg", "jpeg", "png", "gif"].includes(url.split(".").pop().toLowerCase());

	const downloadFile = (url, name) => {
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", name);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(link.href);
			})
			.catch((error) => console.error("Error downloading file:", error));
	};

	return (
		<Container sx={{ mt: 4 }}>
			{/* Business Details */}
			<Card>
				<CardHeader title="Business Details" />
				<CardContent>
					<Box sx={{ mx: 1 }}>
						<Grid container spacing={2}>
							{[
								{ label: "Business Name", value: businessDetails.businessName },
								{
									label: "CAC Registration Number",
									value: businessDetails.cacRegNumber,
								},
								{ label: "TIN Number", value: businessDetails.tinNumber },
								{ label: "RC Number", value: businessDetails.rcNumber },
								{
									label: "Registered Address",
									value: businessDetails.registeredAddress,
								},
								{ label: "Physical Address", value: businessDetails.physicalAddress },
								{
									label: "Functional Mail Address",
									value: businessDetails.functionalMailAddress,
								},
							].map((field, index) => (
								<Grid key={index} xs={12} md={6} p={1}>
									<TextField
										fullWidth
										label={field.label}
										value={field.value || ""}
										disabled
									/>
								</Grid>
							))}
						</Grid>
					</Box>
				</CardContent>
			</Card>

			{/* Documents */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Documents" />
				<CardContent>
					<Box sx={{ mx: 1 }}>
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
													width: 100,
													height: 100,
													cursor: "pointer",
													marginRight: 16,
												}}
												onClick={() => window.open(document.url, "_blank")}
											/>
										) : (
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													cursor: "pointer",
													padding: 1,
													backgroundColor: "#E5E7EB",
													borderRadius: 1,
													transition: "background-color 0.3s ease",
													marginRight: 2,
													"&:hover": { backgroundColor: "#D2D6DB" },
												}}
												onClick={() =>
													document.name.endsWith(".xlsx") || document.name.endsWith(".csv")
														? downloadFile(document.url, document.name)
														: window.open(document.url, "_blank")
												}
											>
												<DocumentIcon style={{ height: 24, width: 24 }} />
												<Typography variant="caption">
													{shortenString(document.name, 50)}
												</Typography>
											</Box>
										)}
										<ListItemText primary={shortenString(document.name, 50)} />
									</ListItem>
								))}
							</List>
						)}
					</Box>
				</CardContent>
			</Card>

			{/* Categories */}
			<Card sx={{ mt: 3 }}>
				<CardHeader title="Categories" />
				<CardContent>
					{categories.length === 0 ? (
						<Typography variant="body2" color="textSecondary">
							No categories available.
						</Typography>
					) : (
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
							{categories.map((category, index) => (
								<Chip key={index} label={category} />
							))}
						</Box>
					)}
				</CardContent>
			</Card>

			{/* Password Change (Only if viewing own profile) */}
			{isViewingOwnProfile && (
				<Card sx={{ mt: 3 }}>
					<CardHeader title="Password Change" />
					<CardContent>
						<Box sx={{ mx: 1 }} component="form" onSubmit={handlePasswordChange}>
							<Grid container spacing={2}>
								{[
									{
										label: "Old Password",
										value: oldPassword,
										setValue: setOldPassword,
									},
									{
										label: "New Password",
										value: newPassword,
										setValue: setNewPassword,
									},
								].map((field, index) => (
									<Grid key={index} xs={12} md={6} p={1}>
										<TextField
											fullWidth
											label={field.label}
											type="password"
											value={field.value}
											onChange={(e) => field.setValue(e.target.value)}
											required
										/>
									</Grid>
								))}
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
