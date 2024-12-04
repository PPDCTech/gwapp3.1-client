import { useEffect, useState, useCallback } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Tooltip,
	CircularProgress,
	TablePagination,
	MenuItem,
	MenuList,
	ListItemIcon,
	ListItemText,
	Select,
	Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
	TrashIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	PrinterIcon,
	PencilSquareIcon,
	ArrowUturnLeftIcon,
	EyeIcon,
} from "@heroicons/react/24/outline";
import { STATUS_COLOR_TYPE } from "../../services/constants";
import { formatAmount, getCurrencySign } from "../../utils/format-currency";
import { shortenString } from "../../utils/format-strings";
import { SeverityPill } from "../../components/severity-pill";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ChatModal from "../../components/chat-modal";
import RequisitionDetailsModal from "../../components/req-details-modal";
import { useAuth } from "../../hooks/use-auth";
import {
	deleteRequisition,
	getRequisitionById,
	sendBackRequisition,
} from "../../services/api/requisition.api";
import { getDateMDY } from "../../services/helpers";
import { fetchSingleUser } from "../../services/api/users.api";
import CreateReqModal from "../../components/create-req";
import { printDocument } from "../../utils/print-document";
import { toast } from "react-toastify";
import AlertModal from "../../components/alert-modal";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const RequisitionTable = ({
	requisitions,
	loading,
	totalCount,
	setRequisitions,
	onEditRequisition,
	updateTableData,
	reqId,
	action,
	page,
	limit,
	onPageChange,
	onLimitChange,
}) => {
	const auth = useAuth();
	const userId = window.localStorage.getItem("gwapp_userId");
	const [user, setUser] = useState(auth?.user);

	const fetchUserData = useCallback(async () => {
		try {
			const response = await fetchSingleUser(userId);
			setUser(response?.data);
			auth.fetchUserData();
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}, [auth, userId]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);

	const [isEditReqModalOpen, setEditReqModalOpen] = useState(false);
	const [selectedRequisition, setSelectedRequisition] = useState(null);
	const [editMode, setEditMode] = useState(false);

	const openChatModal = (reqId) => {
		setSelectedId(reqId);
		setIsChatModalOpen(true);
		updateTableData();
	};
	const closeChatModal = () => {
		setSelectedId("");
		setIsChatModalOpen(false);
		updateTableData();
	};

	const [itemId, setItemId] = useState("");

	const openReqDetails = () => setIsReqDetailsOpen(true);

	const closeReqDetails = () => {
		setIsReqDetailsOpen(false);
		setSelectedId("");
		updateTableData();
	};

	useEffect(() => {
		if (!isReqDetailsOpen) {
			setRequisitions((prevRequisitions) => [...prevRequisitions]);
		}
	}, [isReqDetailsOpen, setRequisitions]);

	const handleOpenReqDetails = useCallback((id) => {
		setSelectedId(id);
		openReqDetails();
	}, []);

	useEffect(() => {
		if (reqId && action === "openModal") {
			handleOpenReqDetails(reqId);
		}
	}, [reqId, action, handleOpenReqDetails]);

	const handleOpenEditModal = async (id) => {
		try {
			const req = await getRequisitionById(id);
			setSelectedRequisition(req.data);
			setEditMode(true);
			setEditReqModalOpen(true);
			updateTableData();
		} catch (error) {
			console.log("Error getting single requisition:", error.message);
		}
	};

	const handleCloseEditModal = () => {
		setEditMode(false);
		setEditReqModalOpen(false);
		updateTableData();
	};

	const updateRequisition = (editedRequisition) => {
		onEditRequisition(editedRequisition);
		updateTableData();
	};

	const [dlertModalOpen, setDlertModalOpen] = useState(false);

	const deleteRetiredHandler = async () => {
		try {
			await deleteRequisition(itemId);
			updateTableData();
			setDlertModalOpen(false);
		} catch (error) {
			console.log("Error deleting requisition as retired:", error.message);
			toast.error("An error occurred. Please try again.");
		}
	};

	const handleSendBackRequisition = async (id) => {
		await sendBackRequisition(id);
		closeReqDetails();
		updateTableData();
	};

	const [printLoading, setPrintLoading] = useState({});

	const handlePrint = async (id) => {
		try {
			setPrintLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
			const response = await getRequisitionById(id);
			const requisition = await response.data;
			const document = await printDocument(requisition);
			pdfMake.createPdf(document).open();
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setPrintLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
		}
	};

	return (
		<>
			{loading && (
				<Typography sx={{ mt: 2 }}>
					<CircularProgress size={10} />
					<small>&nbsp;Loading...</small>
				</Typography>
			)}

			{!loading && requisitions?.length === 0 && (
				<Typography sx={{ mt: 2 }}>No requisitions found.</Typography>
			)}
			{requisitions && requisitions?.length > 0 && (
				<>
					<TableContainer sx={{ mt: 2 }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ width: "10%" }}>SN</TableCell>
									<TableCell sx={{ width: "35%" }}>Title</TableCell>
									<TableCell sx={{ width: "20%" }}>Raised By</TableCell>
									<TableCell sx={{ width: "10%" }}>Amount</TableCell>
									<TableCell sx={{ width: "15%" }}>Date</TableCell>
									<TableCell sx={{ width: "10%" }}>Status</TableCell>
									<TableCell
										sx={{
											width: "15%",
											"@media (max-width: 600px)": {
												display: "none",
											},
										}}
									>
										Actions
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{requisitions &&
									requisitions?.map((requisition) => (
										<TableRow key={requisition?._id}>
											<TableCell>
												{requisition?.serialNumber ? requisition?.serialNumber : "N/A"}
											</TableCell>
											<TableCell
												sx={{
													cursor: "pointer",
													"&:hover": {
														backgroundColor: "#F3F4F6",
														boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
													},
													paddingTop: "2rem",
												}}
												onClick={() => handleOpenReqDetails(requisition?._id)}
											>
												<div
													style={{
														position: "relative",
														display: "inline-block",
													}}
												>
													<Chip
														label={requisition?.type}
														style={{
															position: "absolute",
															top: "-20px",
															left: "0",
															fontSize: "10px",
															height: "18px",
															lineHeight: "18px",
														}}
													/>
													<Tooltip placement="left-start" title={requisition?.title}>
														<span>{shortenString(requisition?.title, 50)}</span>
													</Tooltip>
												</div>
											</TableCell>
											<TableCell>{requisition?.user?.name}</TableCell>
											<TableCell>
												{getCurrencySign(requisition?.currency)}
												{formatAmount(Number(requisition?.total))}
											</TableCell>
											<TableCell>{getDateMDY(requisition?.date)}</TableCell>
											<TableCell>
												<SeverityPill
													color={STATUS_COLOR_TYPE[requisition?.status || "pending"]}
												>
													{requisition?.status === "checked"
														? "financeCheck"
														: requisition?.status}
												</SeverityPill>
											</TableCell>

											{/* Action column */}
											<TableCell className="animated-border">
												{printLoading[requisition._id] && (
													<sup>
														<CircularProgress size={10} />
														<small>&nbsp;Loading..</small>
													</sup>
												)}

												<Select
													sx={{
														"& .MuiOutlinedInput-root": {
															border: "none",
														},
														"& .MuiOutlinedInput-notchedOutline": {
															border: "none",
														},
														"&:hover .MuiOutlinedInput-notchedOutline": {
															border: "none",
														},
														"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
															border: "none",
														},
														"& .MuiFilledInput-underline:after": {
															border: "none",
														},
														"& .MuiFilledInput-underline:before": {
															border: "none",
														},
														"&:hover .MuiFilledInput-underline:before": {
															border: "none",
														},
														"& .MuiFilledInput-underline.Mui-focused:before": {
															border: "none",
														},
													}}
													IconComponent={MoreVertIcon}
													renderValue={(value) => (
														<span>
															<MoreVertIcon />
															{value}
														</span>
													)}
												>
													<MenuList
														sx={{
															border: "none",
														}}
													>
														<Tooltip placement="left-start" title="View details">
															<MenuItem onClick={() => handleOpenReqDetails(requisition?._id)}>
																<ListItemIcon
																	sx={{
																		width: "16px",
																		height: "16px",
																	}}
																>
																	<EyeIcon />
																</ListItemIcon>
																<ListItemText
																	primaryTypographyProps={{
																		fontSize: "small",
																	}}
																	primary="View Details"
																/>
															</MenuItem>
														</Tooltip>
														<Tooltip placement="left-start" title="Messages">
															<MenuItem onClick={() => openChatModal(requisition?._id)}>
																<ListItemIcon
																	sx={{
																		width: "16px",
																		height: "16px",
																	}}
																>
																	<ChatBubbleOvalLeftEllipsisIcon />
																</ListItemIcon>
																<ListItemText
																	primaryTypographyProps={{
																		fontSize: "small",
																	}}
																	primary="Messages"
																/>
															</MenuItem>
														</Tooltip>
														{/* Send back icon conditions */}
														{requisition?.status !== "reviewed" &&
														requisition?.status !== "approved" &&
														user?.position?.some(
															(role) => !["user", "userManager"].includes(role),
														) &&
														requisition?.attentionTo.includes(user?.email) ? (
															<Tooltip placement="left-start" title="Send Back">
																<MenuItem
																	onClick={(e) => handleSendBackRequisition(e, requisition?._id)}
																>
																	<ListItemIcon
																		sx={{
																			width: "16px",
																			height: "16px",
																		}}
																	>
																		<ArrowUturnLeftIcon />
																	</ListItemIcon>
																	<ListItemText
																		primaryTypographyProps={{
																			fontSize: "small",
																		}}
																		primary="Send Back"
																	/>
																</MenuItem>
															</Tooltip>
														) : null}
														{/* Edit condition */}
														{requisition?.status !== "reviewed" &&
														requisition?.status !== "approved" &&
														requisition?.status !== "deleted" &&
														requisition?.retiredStatus !== "retired" &&
														(requisition?.user?.name === user?.name ||
															requisition?.user?.email === user?.email) ? (
															<Tooltip placement="left-start" title="Edit">
																<MenuItem
																	value="edit"
																	onClick={() => handleOpenEditModal(requisition?._id)}
																>
																	<ListItemIcon
																		sx={{
																			width: "16px",
																			height: "16px",
																		}}
																	>
																		<PencilSquareIcon />
																	</ListItemIcon>
																	<ListItemText
																		primaryTypographyProps={{
																			fontSize: "small",
																		}}
																		primary="Edit"
																	/>
																</MenuItem>
															</Tooltip>
														) : null}

														{/* Conditions for Printing */}
														{(requisition?.status === "approved" ||
															requisition?.status === "reviewed" ||
															requisition?.status === "checked") &&
														user?.position?.some((role) =>
															["financeReviewer", "finance", "financeUser", "tech"].includes(
																role,
															),
														) ? (
															<Tooltip placement="left-start" title="Print">
																<MenuItem
																	value="print"
																	onClick={() => handlePrint(requisition?._id)}
																>
																	<ListItemIcon
																		sx={{
																			width: "16px",
																			height: "16px",
																		}}
																	>
																		{printLoading[requisition?._id] ? (
																			<CircularProgress size={20} />
																		) : (
																			<PrinterIcon />
																		)}
																	</ListItemIcon>
																	<ListItemText
																		primaryTypographyProps={{
																			fontSize: "small",
																		}}
																		primary="Print"
																	/>
																</MenuItem>
															</Tooltip>
														) : null}
														{/* Delete condition */}
														{!["approved", "reviewed", "deleted"].includes(
															// Delete condition, only if requisition is not approved or reviewed or deleted then show delete option
															requisition?.status,
														) &&
														requisition?.retiredStatus !== "retired" &&
														(requisition?.user?.name === user?.name ||
															requisition?.user?.email === user?.email) ? (
															<Tooltip placement="top-start" title="Delete">
																<MenuItem
																	value="delete"
																	onClick={() => {
																		setDlertModalOpen(true);
																		setItemId(requisition?._id);
																	}}
																>
																	<ListItemIcon
																		sx={{
																			width: "16px",
																			height: "16px",
																		}}
																	>
																		<TrashIcon />
																	</ListItemIcon>
																	<ListItemText
																		primaryTypographyProps={{
																			fontSize: "small",
																		}}
																		primary="Delete"
																	/>
																</MenuItem>
															</Tooltip>
														) : null}
													</MenuList>
												</Select>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={Number(totalCount)}
						rowsPerPage={limit}
						page={page}
						onPageChange={onPageChange}
						onRowsPerPageChange={onLimitChange}
					/>
				</>
			)}
			<ChatModal
				open={isChatModalOpen}
				onClose={closeChatModal}
				reqId={selectedId}
			/>
			<AlertModal
				open={dlertModalOpen}
				onClose={() => setDlertModalOpen(false)}
				title="Delete Requisition"
				content="Are you sure you want to delete this requisition?"
				onConfirm={deleteRetiredHandler}
			/>
			<RequisitionDetailsModal
				isOpen={isReqDetailsOpen}
				requisitionId={selectedId}
				onClose={closeReqDetails}
				triggerUpdateRequisition={updateRequisition}
				updateTableData={updateTableData}
			/>
			<CreateReqModal
				open={isEditReqModalOpen}
				retireMode={false}
				onClose={handleCloseEditModal}
				triggerUpdateRequisition={updateRequisition}
				isEditMode={editMode}
				requisitionData={selectedRequisition ? selectedRequisition : null}
			/>
		</>
	);
};
