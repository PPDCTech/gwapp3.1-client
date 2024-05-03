import { useEffect, useState } from "react";
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
	Box,
	MenuItem,
	MenuList,
	ListItemIcon,
	ListItemText,
	Select,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
	TrashIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	PrinterIcon,
	PencilSquareIcon,
	ArrowUturnLeftIcon,
	DocumentDuplicateIcon,
	DocumentCheckIcon,
	EyeIcon
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
	markAsRetired,
	sendBackRequisition,
} from "../../services/api/requisition.api";
import { getDateMDY } from "../../services/helpers";
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
}) => {
	const { user } = useAuth();
	const [page, setPage] = useState(0);
	const [rowsPerpage, setRowsPerpage] = useState(10);
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);

	const [isEditReqModalOpen, setEditReqModalOpen] = useState(false);
	const [isRetireReqModalOpen, setRetireReqModalOpen] = useState(false);
	const [selectedRequisition, setSelectedRequisition] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [retireMode, setRetireMode] = useState(false);

	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			const requisition_id = params.get("id");
			const action = params.get("action");

			if (action === "openModal" && requisition_id) {
				setSelectedId(requisition_id);
				openReqDetails();
			}
		} catch (error) {
			console.log("Error:", error);
		}
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerpage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const openChatModal = (reqId) => {
		setSelectedId(reqId);
		setIsChatModalOpen(true);
	};
	const closeChatModal = () => {
		setSelectedId("");
		setIsChatModalOpen(false);
	};

	const [rlertModalOpen, setRlertModalOpen] = useState(false);
	const [itemId, setItemId] = useState("");

	const markAsRetiredHandler = async () => {
		try {
			const res = await markAsRetired(itemId);
			if (res.status === 200) {
				updateTableData();
				toast.success("Requisition marked as retired.");
				setRequisitions((prevRequisitions) =>
					prevRequisitions.filter((req) => req._id !== itemId),
				);
				setRlertModalOpen(false);
			}
		} catch (error) {
			console.log("Error marking requisition as retired:", error.message);
			toast.error("An error occurred. Please try again.");
		}
	};

	const openReqDetails = () => setIsReqDetailsOpen(true);

	const closeReqDetails = () => {
		setIsReqDetailsOpen(false);
		setSelectedId("");
	};

	useEffect(() => {
		if (!isReqDetailsOpen) {
			setRequisitions((prevRequisitions) => [...prevRequisitions]);
		}
	}, [isReqDetailsOpen, setRequisitions]);

	const handleOpenReqDetails = (id) => {
		setSelectedId(id);
		openReqDetails();
	};

	const handleOpenEditModal = async (id) => {
		try {
			const req = await getRequisitionById(id);
			setSelectedRequisition(req.data);
			setEditMode(true);
			setEditReqModalOpen(true);
		} catch (error) {
			console.log("Error getting single requisition:", error.message);
		}
	};
	const handleOpenRetireModal = async (id) => {
		try {
			const req = await getRequisitionById(id);
			setSelectedRequisition(req.data);
			setRetireMode(true);
			setRetireReqModalOpen(true);
		} catch (error) {
			console.log("Error getting single requisition:", error.message);
		}
	};

	const handleCloseEditModal = () => {
		setEditMode(false);
		setEditReqModalOpen(false);
	};
	const handleCloseRetireModal = () => {
		setRetireMode(false);
		setRetireReqModalOpen(false);
	};

	const updateRequisition = (editedRequisition) => {
		onEditRequisition(editedRequisition);
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
		} finally {
			setPrintLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
		}
	};

	return (
		<>
			{loading ? (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
					}}
				>
					<CircularProgress color="success" />
					<Box sx={{ mt: 2 }}>Relax while we load your data...</Box>
				</Box>
			) : (
				<>
					{(!requisitions || requisitions.length === 0) && (
						<Typography sx={{ mt: 2 }}>No requisitions found.</Typography>
					)}

					{requisitions && requisitions.length > 0 && (
						<>
							<TableContainer sx={{ mt: 2 }}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell sx={{ width: "35%" }}>Title</TableCell>
											<TableCell sx={{ width: "15%" }}>Type</TableCell>
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
										{requisitions.map((requisition) => (
											<TableRow key={requisition._id}>
												<TableCell
													sx={{
														cursor: "pointer",
														"&:hover": {
															backgroundColor: "#F3F4F6",
															boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
														},
													}}
													onClick={() => handleOpenReqDetails(requisition._id)}
												>
													<Tooltip placement="left-start" title={requisition.title}>
														<>{shortenString(requisition.title, 40)}</>
													</Tooltip>
												</TableCell>
												<TableCell>{requisition.type}</TableCell>
												<TableCell>
													{getCurrencySign(requisition?.currency)}
													{formatAmount(Number(requisition?.total))}
												</TableCell>
												<TableCell>{getDateMDY(requisition.date)}</TableCell>
												<TableCell>
													<SeverityPill
														color={STATUS_COLOR_TYPE[requisition.status || "pending"]}
													>
														{requisition.status}
													</SeverityPill>
												</TableCell>

												{/* Action column */}
												<TableCell>
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
														<MenuList sx={{ border: "none" }}>
															<Tooltip placement="left-start" title="View details">
																<MenuItem onClick={() => handleOpenReqDetails(requisition._id)}>
																	<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																		<EyeIcon />
																	</ListItemIcon>
																	<ListItemText
																		primaryTypographyProps={{ fontSize: "small" }}
																		primary="View Details"
																	/>
																</MenuItem>
															</Tooltip>
															<Tooltip placement="left-start" title="Messages">
																<MenuItem onClick={() => openChatModal(requisition._id)}>
																	<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																		<ChatBubbleOvalLeftEllipsisIcon />
																	</ListItemIcon>
																	<ListItemText
																		primaryTypographyProps={{ fontSize: "small" }}
																		primary="Messages"
																	/>
																</MenuItem>
															</Tooltip>
															{/* Send back icon conditions */}
															{requisition.status !== "reviewed" &&
															requisition.status !== "approved" &&
															user.accessLevel !== "user" &&
															user.accessLevel !== "userManager" &&
															requisition.attentionTo.includes(user.email) ? (
																<Tooltip placement="left-start" title="Send Back">
																	<MenuItem
																		onClick={(e) => handleSendBackRequisition(e, requisition._id)}
																	>
																		<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																			<ArrowUturnLeftIcon />
																		</ListItemIcon>
																		<ListItemText
																			primaryTypographyProps={{ fontSize: "small" }}
																			primary="Send Back"
																		/>
																	</MenuItem>
																</Tooltip>
															) : null}
															{/* Edit condition */}
															{requisition.status !== "reviewed" &&
															requisition.status !== "approved" &&
															requisition.status !== "deleted" &&
															requisition.retiredStatus !== "retired" &&
															(requisition.user.name === user.name ||
																requisition.user.email === user.email) ? (
																<Tooltip placement="left-start" title="Edit">
																	<MenuItem
																		value="edit"
																		onClick={() => handleOpenEditModal(requisition._id)}
																	>
																		<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																			<PencilSquareIcon />
																		</ListItemIcon>
																		<ListItemText
																			primaryTypographyProps={{ fontSize: "small" }}
																			primary="Edit"
																		/>
																	</MenuItem>
																</Tooltip>
															) : null}
															{/* Request retire condition */}
															{requisition.status === "approved" &&
															(requisition.user.name === user.name ||
																requisition.user.email === user.email ||
																["tech"].includes(user.accessLevel)) ? (
																<Tooltip placement="left-start" title="Retire">
																	<MenuItem
																		value="retire"
																		onClick={() => handleOpenRetireModal(requisition._id)}
																	>
																		<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																			<DocumentDuplicateIcon />
																		</ListItemIcon>
																		<ListItemText
																			primaryTypographyProps={{ fontSize: "small" }}
																			primary="Request Retire"
																		/>
																	</MenuItem>
																</Tooltip>
															) : null}
															{/* Mark as retired condition */}
															{requisition.status === "approved" &&
															["tech", "finance", "financeReviewer"].includes(
																user.accessLevel,
															) ? (
																<Tooltip placement="left-start" title="Mark as Retired">
																	<MenuItem
																		value="Mark as Retired"
																		onClick={() => {
																			setRlertModalOpen(true);
																			setItemId(requisition._id);
																		}}
																	>
																		<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																			<DocumentCheckIcon />
																		</ListItemIcon>
																		<ListItemText
																			primaryTypographyProps={{ fontSize: "small" }}
																			primary="Mark as Retired"
																		/>
																	</MenuItem>
																</Tooltip>
															) : null}
															{/* Conditions for Printing */}
															{requisition.status === "approved" &&
															(requisition.user.name === user.name ||
																requisition.user.email === user.email ||
																["tech", "finance", "financeReviewer"].includes(
																	user.accessLevel,
																)) ? (
																<Tooltip placement="left-start" title="Print">
																	<MenuItem
																		value="print"
																		onClick={() => handlePrint(requisition._id)}
																	>
																		<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																			{printLoading[requisition._id] ? (
																				<CircularProgress size={20} />
																			) : (
																				<PrinterIcon />
																			)}
																		</ListItemIcon>
																		<ListItemText
																			primaryTypographyProps={{ fontSize: "small" }}
																			primary="Print"
																		/>
																	</MenuItem>
																</Tooltip>
															) : null}
															{/* Delete condition */}
															{requisition.status !== "approved" &&
															requisition.status !== "reviewed" &&
															requisition.status !== "deleted" &&
															requisition.status !== "retired" &&
															(requisition.user.name === user.name ||
																requisition.user.email === user.email) ? (
																<Tooltip placement="left-start" title="Delete">
																	<MenuItem
																		value="delete"
																		onClick={() => {
																			setDlertModalOpen(true);
																			setItemId(requisition._id);
																		}}
																	>
																		<ListItemIcon sx={{ width: "16px", height: "16px" }}>
																			<TrashIcon />
																		</ListItemIcon>
																		<ListItemText
																			primaryTypographyProps={{ fontSize: "small" }}
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
								rowsPerPage={rowsPerpage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</>
					)}
				</>
			)}
			<ChatModal
				open={isChatModalOpen}
				onClose={closeChatModal}
				reqId={selectedId}
			/>
			<AlertModal
				open={rlertModalOpen}
				onClose={() => setRlertModalOpen(false)}
				title="Mark Requisition as Retired"
				content="Are you sure you want to mark this requisition as retired?"
				onConfirm={markAsRetiredHandler}
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
			/>
			<CreateReqModal
				open={isEditReqModalOpen ? isEditReqModalOpen : isRetireReqModalOpen}
				retireMode={retireMode}
				onClose={retireMode ? handleCloseRetireModal : handleCloseEditModal}
				triggerUpdateRequisition={updateRequisition}
				isEditMode={editMode}
				requisitionData={selectedRequisition ? selectedRequisition : null}
			/>
		</>
	);
};
