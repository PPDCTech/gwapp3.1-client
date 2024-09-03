import { useState, useEffect, Suspense, useCallback } from "react";
import {
	Modal,
	Grid,
	Paper,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Box,
	Divider,
	IconButton,
	SvgIcon,
	Button,
	TextField,
	Container,
	Autocomplete,
	Tooltip,
	Badge,
} from "@mui/material";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import {
	capitalizeFirstLetter,
	currencyCodes,
	formatAmount,
	getDateForPrintSpace,
} from "../services/helpers";
import accounting from "accounting";
import { DocumentIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EMPTY_REQ_VALUES, STATUS_COLOR_TYPE } from "../services/constants";
import { useAuth } from "../hooks/use-auth";
import {
	approveRequisition,
	budgetHolderCheckRequisition,
	cancelRequisition,
	deleteRequisition,
	financeCheckRequisition,
	financeReviewRequisition,
	getRequisitionById,
	sendBackRequisition,
} from "../services/api/requisition.api";
import { fetchSingleUser } from "../services/api/users.api";
import { toast } from "react-toastify";
import { indigo, info, success } from "../theme/colors";
import { addMessage, fetchMessages } from "../services/api/message-chat.api";
import ChatModal from "./chat-modal";
import { getAllAccountCodes } from "../services/api/account-codes.api";
import { markAsRetired } from "../services/api/requisition.api";
import AlertModal from "../components/alert-modal";

const RequisitionDetailsModal = ({
	isOpen,
	onClose,
	requisitionId,
	triggerUpdateRequisition,
	isRetirement,
	updateTableData,
}) => {
	const auth = useAuth();

	const [user, setUser] = useState(auth?.user);

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

	const [loading, setLoading] = useState(false);
	const [requisition, setRequisition] = useState(EMPTY_REQ_VALUES);
	const [loadingCheckBtn, setLoadingCheckBtn] = useState(false);
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [accountCodes, setAccountCodes] = useState([]);
	const [newAccountCode, setNewAccountCode] = useState(null);
	const [messageCounter, setMessageCounter] = useState("0");

	const getAccountCodes = useCallback(async () => {
		try {
			// Fetch account codes
			const accountCodesResponse = await getAllAccountCodes();
			// Update account codes if there is a change
			if (accountCodesResponse.data) {
				setAccountCodes(accountCodesResponse.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, []);

	useEffect(() => {
		async function fetchData() {
			try {
				// Check if requisitionId is defined before fetching messages
				if (requisitionId) {
					const messagesResponse = await fetchMessages(requisitionId);

					// Update message counter if there is a change
					if (messagesResponse.data) {
						setMessageCounter(messagesResponse.data.length.toString());
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}

		fetchData();
	}, [requisitionId]);

	const tableDataUpdate = useCallback(
		() => updateTableData(),
		[updateTableData],
	);

	useEffect(() => {
		tableDataUpdate();
	}, [tableDataUpdate]);

	useEffect(() => {
		getAccountCodes();
	}, [isOpen, getAccountCodes]);

	const openChatModal = () => setIsChatModalOpen(true);
	const closeChatModal = () => setIsChatModalOpen(false);

	useEffect(() => {
		const fetchRequisitionDetails = async () => {
			setLoading(true);
			try {
				const response = await getRequisitionById(requisitionId);
				console.log("Requisition details:", response.data);
				setRequisition(response.data);
			} catch (error) {
				console.error("Error fetching requisition details:", error);
			} finally {
				setLoading(false);
			}
		};

		if (isOpen && requisitionId) {
			fetchRequisitionDetails();
		}
	}, [isOpen, requisitionId]);

	const renderCheckRow = (status, checkedBy) => {
		return (
			<TableRow key={status}>
				<TableCell>{status}</TableCell>
				<TableCell>{checkedBy.name}</TableCell>
			</TableRow>
		);
	};

	const checker_info = {
		name: user?.name,
		email: user?.email,
		signatureUrl: user?.signatureUrl,
	};

	const reqIsUpdated = () => toast.info("Requisition Updated");

	const handleDeleteRequisition = async () => {
		await deleteRequisition(requisitionId);
		reqIsUpdated();
		onClose();
	};

	const handleBudgetHolderChecked = async () => {
		setLoadingCheckBtn(true);

		await budgetHolderCheckRequisition(requisitionId, checker_info);
		reqIsUpdated();
		onClose();
		setLoadingCheckBtn(false);
	};

	const handleFinanceChecked = async () => {
		setLoadingCheckBtn(true);
		if (!newAccountCode) {
			return toast.warning("Please select account code!");
		}

		const payload = {
			...checker_info,
			accountCode: `${newAccountCode?._id ?? ""}-${newAccountCode?.value ?? ""}-${
				newAccountCode?.description ?? ""
			}`,
		};
		await financeCheckRequisition(requisitionId, payload);
		reqIsUpdated();
		onClose();
		setLoadingCheckBtn(false);
	};

	const handleFinanceReviewed = async () => {
		setLoadingCheckBtn(true);
		await financeReviewRequisition(requisitionId, checker_info);
		reqIsUpdated();
		onClose();
		setLoadingCheckBtn(false);
	};
	const handleApprove = async () => {
		setLoadingCheckBtn(true);
		await approveRequisition(requisitionId, checker_info);
		reqIsUpdated();
		onClose();
		setLoadingCheckBtn(false);
	};

	const handleSendBack = async () => {
		await sendBackRequisition(requisitionId);
		onClose();
	};

	const handleCancelPayment = async () => {
		await cancelRequisition(requisitionId);
		onClose();
	};

	const [showReasonInput, setShowReasonInput] = useState(false);
	const [reason, setReason] = useState("");
	const [originalButtonLabel, setOriginalButtonLabel] = useState("");

	const handleButtonClick = (label) => {
		setShowReasonInput(true);
		setOriginalButtonLabel(label);
	};

	const handleAbort = () => {
		setShowReasonInput(false);
		setReason("");
	};

	const handleSubmit = async () => {
		await addMessage(requisitionId, user._id, reason);
		if (originalButtonLabel === "Cancel") {
			handleCancelPayment();
		} else if (originalButtonLabel === "Send Back") {
			handleSendBack();
		}
		setShowReasonInput(false);
		setReason("");
	};

	const isValidRequisition =
		requisition && requisition?.title && requisition?.status;

	const [rlertModalOpen, setRlertModalOpen] = useState(false);

	const markAsRetiredHandler = async () => {
		try {
			const res = await markAsRetired(requisitionId);
			if (res.status === 200) {
				tableDataUpdate();
				toast.success("Requisition marked as retired.");
				setRlertModalOpen(false);
			}
		} catch (error) {
			console.log("Error marking requisition as retired:", error.message);
			toast.error("An error occurred. Please try again.");
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
		<>
			<Modal open={isOpen} onClose={onClose}>
				<Paper
					style={{
						maxWidth: "70%",
						margin: "auto",
						marginTop: "50px",
						padding: "20px",
						overflowY: "auto",
						maxHeight: "90vh",
					}}
				>
					{loading && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginTop: "50px",
							}}
						>
							Fetching...
							{/* <CircularProgress color="success" /> */}
						</Box>
					)}

					{!isValidRequisition && !loading && (
						<Typography variant="body1" align="center" style={{ marginTop: "50px" }}>
							No requisition found with the searched ID.
						</Typography>
					)}

					{isValidRequisition && (
						<>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between ",
								}}
							>
								<Typography variant="h6">Requisition Details</Typography>

								<Box>
									{/* Chat button */}
									<Tooltip title="Drop a message to the requester">
										<IconButton onClick={openChatModal} color="info">
											<SvgIcon fontSize="small">
												<ChatBubbleLeftEllipsisIcon />
											</SvgIcon>
										</IconButton>
									</Tooltip>
									<Tooltip
										title={
											messageCounter === "0"
												? "No new message"
												: "You have new message, click to view"
										}
									>
										<IconButton onClick={openChatModal}>
											<Badge badgeContent={messageCounter} color="success">
												<SvgIcon fontSize="small">
													<BellIcon />
												</SvgIcon>
											</Badge>
										</IconButton>
									</Tooltip>

									{/* Close details button */}
									<IconButton color="error" onClick={onClose} sx={{ ml: 2 }}>
										<SvgIcon fontSize="medium">
											<XCircleIcon />
										</SvgIcon>
									</IconButton>
								</Box>
							</Box>
							<Grid container spacing={3} padding={2}>
								<Grid item xs={3}>
									<Typography variant="subtitle2" align="center">
										<strong>Type</strong>
									</Typography>
									<Typography variant="subtitle2" align="center">
										{requisition.type}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="subtitle2" align="center">
										<strong>Raised By</strong>
									</Typography>
									<Typography variant="subtitle2" align="center">
										{requisition.user.name}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="subtitle2" align="center">
										<strong>Date</strong>
									</Typography>
									<Typography variant="subtitle2" align="center">
										{getDateForPrintSpace(requisition.date)}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="subtitle2" align="center">
										<strong>Serial Number</strong>
									</Typography>
									<Typography variant="subtitle2" align="center">
										{requisition.serialNumber || "N/A"}
									</Typography>
								</Grid>

								{requisition.status === "approved" && (
									<Grid item xs={3}>
										<Typography variant="subtitle2" align="center">
											<strong>Approval Number</strong>
										</Typography>
										<Typography variant="subtitle2" align="center">
											{requisition.approvalNumber || "N/A"}
										</Typography>
									</Grid>
								)}
							</Grid>

							<Divider sx={{ mt: 1, borderColor: "neutral.300" }} />

							<Grid container spacing={3} padding={2}>
								{/* Description */}
								<Grid item xs={12} sx={{ mb: 2 }}>
									<Typography variant="subtitle2">Description</Typography>
									<Typography variant="body1">{requisition.title}</Typography>
								</Grid>

								<Grid item xs={4}>
									<TableContainer>
										<Table>
											<TableBody>
												<TableRow>
													<TableCell component="th" scope="row">
														Status:
													</TableCell>
													<TableCell>
														<Typography
															variant="body2"
															sx={{
																color: (theme) =>
																	STATUS_COLOR_TYPE[requisition.status] &&
																	theme.palette.text.primary,
																backgroundColor: (theme) =>
																	STATUS_COLOR_TYPE[requisition.status] &&
																	theme.palette[STATUS_COLOR_TYPE[requisition.status]].light,
																display: "inline",
																marginRight: "8px",
																padding: "4px 8px",
																borderRadius: "4px",
															}}
														>
															{capitalizeFirstLetter(requisition.status)}
														</Typography>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell component="th" scope="row">
														Retirement:
													</TableCell>
													<TableCell>
														<Typography
															variant="body2"
															sx={{
																color: (theme) =>
																	STATUS_COLOR_TYPE[requisition.retiredStatus || "cancelled"] &&
																	theme.palette.text.primary,
																backgroundColor: (theme) =>
																	STATUS_COLOR_TYPE[requisition.retiredStatus || "cancelled"] &&
																	theme.palette[
																		STATUS_COLOR_TYPE[requisition.retiredStatus || "cancelled"]
																	].light,
																display: "inline",
																marginRight: "8px",
																padding: "4px 8px",
																borderRadius: "4px",
															}}
														>
															{capitalizeFirstLetter(
																requisition.retiredStatus || "controlled",
															)}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</Grid>

								{/* Check history */}
								<Grid item xs={8} sx={{ boxShadow: "0 0 2px grey" }}>
									{/* <Accordion expanded={expanded} onChange={handleAccordionChange}>
										<AccordionSummary
											expandIcon={<ChevronDownIcon className="h-6 w-6 text-gray-500" />}
											aria-controls="check-history-content"
										>
											<Typography variant="subtitle2">
												{expandedText} Status History
											</Typography>
										</AccordionSummary>
										<AccordionDetails> */}
									<Typography variant="subtitle2">Status History</Typography>
									<TableContainer component={Paper}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>Status</TableCell>
													<TableCell>By</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{requisition.holderCheck &&
													renderCheckRow("Checked", requisition.holderCheck)}
												{requisition.checkedBy &&
													renderCheckRow("Finance Check", requisition.checkedBy)}
												{requisition.reviewedBy &&
													renderCheckRow("Finance Review", requisition.reviewedBy)}
												{requisition.approvedBy &&
													renderCheckRow("Approved", requisition.approvedBy)}
											</TableBody>
										</Table>
									</TableContainer>
									{/* </AccordionDetails>
									</Accordion> */}
								</Grid>

								{/* Item List */}
								<Grid item xs={12} sx={{ mt: 2 }}>
									<Typography variant="subtitle2">Items List</Typography>

									<TableContainer component={Paper} sx={{ mt: 1 }}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>Title</TableCell>
													<TableCell>Amount</TableCell>
													<TableCell>Budget Code</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{requisition.items.map((item, index) => (
													<TableRow key={index}>
														<TableCell>{item.title}</TableCell>
														<TableCell>{formatAmount(item.amount)}</TableCell>
														<TableCell>{item.code}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
									<Box sx={{ mt: 2 }}>
										<Typography variant="subtitle2">Total</Typography>
										<Typography variant="body2">
											<strong>
												{accounting.formatMoney(
													requisition.total,
													currencyCodes[requisition.currency],
												)}
											</strong>
										</Typography>
									</Box>
								</Grid>

								{/* Invoices */}
								<Grid item xs={12}>
									<Typography variant="subtitle2">Invoices</Typography>
									<Grid container spacing={2}>
										{(requisition.invoices && requisition.invoices.length > 0
											? requisition.invoices
											: requisition.receipts || []
										).map((document, index) => (
											<Grid item key={index}>
												{isImage(document.url) ? (
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
								</Grid>
							</Grid>

							<Divider sx={{ my: 1, borderColor: "neutral.300" }} />

							<Grid container spacing={2} padding={2}>
								{/* Beneficiary Details */}
								<Grid item xs={12}>
									<Typography variant="subtitle1">Beneficiary Details:</Typography>
								</Grid>
								<Grid item xs={4}>
									<Typography variant="subtitle2">Bank</Typography>
									<Typography variant="body1">{requisition.bankName}</Typography>
								</Grid>
								<Grid item xs={4}>
									<Typography variant="subtitle2">Account Holder</Typography>
									<Typography variant="body1">{requisition.accountName}</Typography>
								</Grid>
								<Grid item xs={4}>
									<Typography variant="subtitle2">Account Number</Typography>
									<Typography variant="body1">{requisition.accountNumber}</Typography>
								</Grid>

								<Grid item xs={12}>
									<Divider sx={{ borderColor: "neutral.300" }} />
								</Grid>
							</Grid>

							{/* {!(user?.role === "staff" || user?.role === "user") && ( */}
							<>
								{requisition.projectChargedTo && (
									<Grid container space={2} padding={2}>
										<Typography sx={{ my: 3 }}>Project Account Section</Typography>
										{requisition.projectChargedTo && (
											<Grid item xs={12}>
												<Typography variant="subtitle1">
													Project Charged to:{" "}
													<strong>{requisition.projectChargedTo?.projectName || ""}</strong>
												</Typography>
											</Grid>
										)}
										<Grid item xs={4}>
											<Typography variant="subtitle2">Source Bank</Typography>
											<Typography variant="body1">
												{requisition.projectChargedTo.account.bankName}
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography variant="subtitle2">Holder</Typography>
											<Typography variant="body1">
												{requisition.projectChargedTo.account.accountName}
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography variant="subtitle2">Account Number</Typography>
											<Typography variant="body1">
												{requisition.projectChargedTo.account.accountNumber}
											</Typography>
										</Grid>
									</Grid>
								)}

								<Divider />

								{/* Select account codes (for finance) */}
								{(requisition.status === "holderCheck" ||
									requisition.status === "holderChecked") &&
									user?.position?.includes("finance") && (
										<Grid container spacing={3} sx={{ pl: 2 }}>
											<Grid item xs={4}>
												<Typography variant="body1" sx={{ my: 1 }}>
													Select Account Code
												</Typography>
												<Autocomplete
													fullWidth
													options={accountCodes}
													getOptionLabel={(accountCode) =>
														`${accountCode?.value}-${accountCode?.description}` || ""
													}
													value={newAccountCode}
													onChange={(event, newValue) => {
														setNewAccountCode(newValue);
													}}
													renderInput={(params) => (
														<TextField {...params} label="Account Codes" fullWidth />
													)}
												/>
											</Grid>
										</Grid>
									)}

								{/* Action/Check section */}
								<Container>
									{/* Buttons based on requisition status and user access level */}
									{requisition.status === "pending" &&
									user?.position?.some((role) => ["budgetHolder"].includes(role)) &&
									requisition.attentionTo.includes(user?.email) ? (
										<>
											<Button
												variant="contained"
												color="secondary"
												size="small"
												onClick={() => handleBudgetHolderChecked()}
												disabled={loadingCheckBtn}
											>
												{loadingCheckBtn ? "Loading..." : "Check as Budget Holder"}
											</Button>
											<Button
												size="small"
												sx={{ ml: 2 }}
												variant="outlined"
												color="error"
												onClick={() => handleSendBack()}
												disabled={loadingCheckBtn}
											>
												{loadingCheckBtn ? "Loading..." : "Send Back"}
											</Button>
										</>
									) : requisition.status === "pending" ? (
										<Typography style={{ color: info.main }}>
											Request Awaiting Budget Holder Check
										</Typography>
									) : ["checked", "holderCheck", "holderChecked", "sentBack"].includes(
											requisition?.status,
									  ) && user?.position?.some((role) => ["finance"].includes(role)) ? (
										<>
											<Button
												variant="contained"
												color="primary"
												disabled={loadingCheckBtn}
												size="small"
												onClick={() => handleFinanceChecked()}
											>
												{loadingCheckBtn ? "Loading..." : "Finance Check"}
											</Button>
											<Button size="small" onClick={() => handleSendBack()}>
												Send Back
											</Button>
										</>
									) : requisition.status === "holderChecked" ||
									  requisition.status === "holderChecke" ? (
										<Typography sx={{ color: indigo.main }}>
											Request Awaiting Finance Check
										</Typography>
									) : ["checked", "sentBack"].includes(requisition?.status) &&
									  user?.position?.some((role) =>
											["financeReviewer"].includes(role),
									  ) ? (
										<Box sx={{ display: "flex" }}>
											<Button
												onClick={() => handleFinanceReviewed()}
												variant="contained"
												color="info"
												disabled={loadingCheckBtn}
												size="small"
											>
												{loadingCheckBtn ? "Loading..." : "Finance Review"}
											</Button>
											<Button size="small" onClick={() => handleSendBack()} sx={{ ml: 2 }}>
												Send Back
											</Button>
											<Button size="small" onClick={() => onClose()} sx={{ ml: 2 }}>
												Cancel
											</Button>
										</Box>
									) : requisition.status === "checked" ? (
										<Typography sx={{ color: success.main }}>
											Request Awaiting Finance Review
										</Typography>
									) : requisition.status === "reviewed" &&
									  user?.position?.some((role) => ["superUser"].includes(role)) ? (
										<Box sx={{ display: "flex" }}>
											<Button
												size="small"
												onClick={() => handleApprove()}
												variant="contained"
												color="success"
												disabled={loadingCheckBtn}
											>
												{loadingCheckBtn ? "Loading..." : "Approve"}
											</Button>
											<Button size="small" onClick={() => handleSendBack()} sx={{ ml: 2 }}>
												Send Back
											</Button>
											<Button size="small" onClick={() => onClose()} sx={{ ml: 2 }}>
												Cancel
											</Button>
										</Box>
									) : requisition.status === "reviewed" ? (
										<Typography sx={{ color: success.ppdc }}>
											Request Awaiting Approval
										</Typography>
									) : requisition.status === "approved" &&
									  user?.position?.some((role) =>
											["financeReviewer", "finance"].includes(role),
									  ) ? (
										<>
											{isRetirement ? (
												<Button
													size="small"
													onClick={() => setRlertModalOpen(true)}
													startIcon={<LibraryAddCheckIcon />}
												>
													Mark as Retired
												</Button>
											) : (
												<Button size="small" onClick={() => handleCancelPayment()}>
													Cancel Payment
												</Button>
											)}
										</>
									) : null}

									{requisition.status === "approved" && (
										<Typography
											sx={{
												mt: 2,
												color: success.ppdc,
												textAlign: "center",
											}}
										>
											<strong>This request is Approved!</strong>
										</Typography>
									)}

									<Divider sx={{ my: 1 }} />

									{/* Send Back and Cancel Actions */}
									<>
										{showReasonInput && (
											<Grid container spacing={1} alignItems="center">
												<Grid item xs={8}>
													<TextField
														label="Enter Reason"
														variant="outlined"
														value={reason}
														onChange={(e) => setReason(e.target.value)}
														fullWidth
													/>
												</Grid>
												<Grid item xs={2}>
													<Button
														size="small"
														variant="contained"
														color="info"
														onClick={handleSubmit}
													>
														Submit
													</Button>
												</Grid>
												<Grid item xs={2}>
													<Button
														size="small"
														variant="contained"
														color="secondary"
														onClick={handleAbort}
													>
														Abort
													</Button>
												</Grid>
											</Grid>
										)}

										{!showReasonInput && (
											<>
												{requisition.status === "approved" &&
													user?.position?.includes("financeReviewer") && (
														<Button
															variant="contained"
															size="small"
															color="error"
															onClick={() => handleButtonClick("Cancel")}
														>
															Cancel
														</Button>
													)}
											</>
										)}
									</>

									{/* Delete button */}
									{requisition.status !== "approved" &&
										requisition?.user?.name === user?.name && (
											<Button
												sx={{ ml: 2 }}
												variant="outlined"
												color="error"
												size="small"
												onClick={handleDeleteRequisition}
											>
												Delete Request
											</Button>
										)}
								</Container>
							</>
							{/**  )} **/}
						</>
					)}
				</Paper>
			</Modal>
			{requisitionId && (
				<Suspense fallback={null}>
					<ChatModal
						open={isChatModalOpen}
						onClose={closeChatModal}
						reqId={requisitionId}
					/>
				</Suspense>
			)}
			<Suspense fallback={null}>
				<AlertModal
					open={rlertModalOpen}
					onClose={() => setRlertModalOpen(false)}
					title="Mark Requisition as Retired"
					content="Are you sure you want to mark this requisition as retired?"
					onConfirm={markAsRetiredHandler}
				/>
			</Suspense>
		</>
	);
};

export default RequisitionDetailsModal;
