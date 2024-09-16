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
import { useAuth } from "../../hooks/use-auth";
import {
	applyForContract,
	deleteContract,
} from "../../services/contract-api-Services";
import AwardContractModal from "../../components/award-contract";
import CreateContractModal from "../../components/create-contract";
import AlertModal from "../../components/alert-modal";
import { shortenString } from "../../utils/format-strings";

export const ContractsTable = ({
	title,
	contracts,
	loading,
	totalPages,
	currentPage,
	handleNextPage,
	handlePreviousPage,
	fetchContracts,
	setKeyword,
}) => {
	const auth = useAuth();
	const [user, setUser] = useState(auth?.user);
	const [awardModalOpen, setAwardModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [contractData, setContractData] = useState({});
	const [contractId, setContractId] = useState("");

	const isVendor = window.localStorage.getItem("isVendor") === "true";

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

	const [expanded, setExpanded] = useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleSearchChange = (e) => {
		setKeyword(e.target.value);
		fetchContracts();
	};

	const handleDelete = async () => {
		try {
			await deleteContract(contractId);
			toast.success("Contract deleted successfully");
			fetchContracts();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const openDeleteModal = (contractId) => {
		setContractId(contractId);
		setDeleteModalOpen(true);
	};

	const handleAward = (data) => {
		setContractData(data);
		setAwardModalOpen(true);
	};

	const handleOpenEditModal = (data) => {
		setContractData(data);
		setEditModalOpen(true);
	};

	const handleIndicateInterest = async (contractId) => {
		try {
			await applyForContract(contractId);
			toast.success("Interest indicated successfully");
			fetchContracts();
		} catch (error) {
			toast.error(error.message);
		}
	};

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<>
			{contracts && contracts.length > 0 ? (
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

					{contracts.map((contract, index) => (
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
									{shortenString(contract?.title, 70) || "..."}
								</Typography>
								<Typography component={"span"} sx={{ color: "text.secondary" }}>
									<strong>Contract Number: </strong> {contract?.number ?? "N/A"}
								</Typography>
							</AccordionSummary>
							<AccordionDetails sx={{ bgcolor: "#f5f5f5" }}>
								<Box sx={{ flexGrow: 1 }}>
									<Grid container spacing={2}>
										{/* Contract Details */}
										<Grid item xs={12}>
											<Typography variant="h6">Contract Details</Typography>
											<Divider sx={{ mb: 2 }} />
											<Grid container spacing={2}>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Project
													</Typography>
													<Typography variant="body1">
														{contract?.projectCode || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Category
													</Typography>
													<Typography variant="body1">
														{contract?.category || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Duration
													</Typography>
													<Typography variant="body1">
														{contract?.duration || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Published Date
													</Typography>
													<Typography variant="body1">
														{new Date(contract?.createdAt).toLocaleDateString() || "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Awarded Date
													</Typography>
													<Typography variant="body1">
														{contract?.awardedDate
															? new Date(contract.awardedDate).toLocaleDateString()
															: "N/A"}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Value
													</Typography>
													<Typography variant="body1">
														{contract?.value?.toLocaleString() || "N/A"} {contract?.currency}
													</Typography>
												</Grid>
												<Grid item xs={6} md={4}>
													<Typography variant="body2" display="block" gutterBottom>
														Description
													</Typography>
													<Typography variant="body1">
														{contract?.description || "N/A"}
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
													contract?.status === "open"
														? "primary"
														: contract?.status === "awarded"
														? "success"
														: "error"
												}
											>
												{contract?.status?.toUpperCase() || "N/A"}
											</Typography>{" "}
										</Grid>

										{/* Applicants */}
										<Grid item xs={12}>
											<Typography variant="h6">Applicants</Typography>
											<Divider sx={{ mb: 2 }} />
											<Typography variant="body1">
												{contract?.applicants?.length || 0} Applicants
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
											{isVendor && (
												<Button
													onClick={() => handleIndicateInterest(contract._id)}
													color={
														contract?.applicants?.includes(user?._id) ||
														contract?.awardedVendor
															? "success"
															: "warning"
													}
													// if contract applicants contains the user id, disable the button
													// if constract has awardedVendor, disable the button
													disabled={
														contract?.applicants?.includes(user?._id) ||
														contract?.awardedVendor
													}
													variant="outlined"
												>
													Indicate Interest
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
													onClick={() => handleOpenEditModal(contract)}
													color="primary"
												>
													Edit Contract
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
												<Button onClick={() => handleAward(contract)} color="success">
													Award Contract
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
												<Button onClick={() => openDeleteModal(contract._id)} color="error">
													Delete
												</Button>
											)}
										</Box>
									</Box>
								</Box>
							</AccordionDetails>
						</Accordion>
					))}

					{/* Paginate when contracts are more than 10 */}
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
				<Typography sx={{ mt: 2 }}>No Contracts found.</Typography>
			)}

			<AwardContractModal
				open={awardModalOpen}
				onClose={() => setAwardModalOpen(false)}
				contractData={contractData}
				fetchContracts={fetchContracts}
			/>

			<CreateContractModal
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				contractData={contractData}
				fetchContracts={fetchContracts}
				isEditMode={true}
			/>

			<AlertModal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title={"Delete Contract"}
				content={"Are you sure you want to delete this contract?"}
			/>
		</>
	);
};
