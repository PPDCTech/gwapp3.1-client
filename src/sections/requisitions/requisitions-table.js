import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Typography,
	SvgIcon,
	Grid,
	Tooltip,
	CircularProgress,
	TablePagination,
	Box,
	MenuItem,
	Select,
} from "@mui/material";
import {
	TrashIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	PrinterIcon,
	PencilSquareIcon,
	ArrowUturnLeftIcon,
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
import CreateReqModal from "../../components/create-req";
import { printDocument } from "../../utils/print-document";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const RequisitionTable = ({
	requisitions,
	loading,
	totalCount,
	setRequisitions,
	onEditRequisition,
}) => {
	const { user } = useAuth();
	const [page, setPage] = useState(0);
	const [rowsPerpage, setRowsPerpage] = useState(10);
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);

	const [isEditReqModalOpen, setEditReqModalOpen] = useState(false);
	const [selectedRequisition, setSelectedRequisition] = useState(null);
	const [editMode, setEditMode] = useState(false);

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

	const handleCloseEditModal = () => {
		setEditMode(false);
		setEditReqModalOpen(false);
	};

	const updateRequisition = (editedRequisition) => {
		onEditRequisition(editedRequisition);
	};

	const handleDeleteRequisition = async (id) => {
		console.log("deleting..", id);
		await deleteRequisition(id);
		setRequisitions(requisitions.filter((req) => req._id !== id));
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
													<Tooltip title={requisition.title}>
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
													<Select>
														<Tooltip title="Messages">
															<MenuItem onClick={() => openChatModal(requisition._id)}>
																<IconButton
																	sx={{
																		backgroundColor: "info.main",
																		color: "#fff",
																		"&:hover": {
																			backgroundColor: "info.dark",
																		},
																	}}
																	onClick={() => openChatModal(requisition._id)}
																>
																	<SvgIcon fontSize="small">
																		<ChatBubbleOvalLeftEllipsisIcon />
																	</SvgIcon>
																</IconButton>
															</MenuItem>
														</Tooltip>
														{/* Send back icon conditions */}
														{requisition.status !== "reviewed" &&
														requisition.status !== "approved" &&
														user.accessLevel !== "user" &&
														user.accessLevel !== "userManager" &&
														requisition.attentionTo.includes(user.email) ? (
															<Tooltip title="Send Back">
																<MenuItem
																	onClick={(e) => handleSendBackRequisition(e, requisition._id)}
																>
																	<IconButton
																		sx={{
																			backgroundColor: "warning.main",
																			color: "#fff",
																			"&:hover": {
																				backgroundColor: "warning.dark",
																			},
																		}}
																		onClick={(e) => handleSendBackRequisition(e, requisition._id)}
																	>
																		<SvgIcon fontSize="small">
																			<ArrowUturnLeftIcon />
																		</SvgIcon>
																	</IconButton>
																</MenuItem>
															</Tooltip>
														) : null}

														{/* Edit condition */}
														{requisition.status !== "reviewed" &&
														requisition.status !== "approved" &&
														requisition.status !== "deleted" &&
														(requisition.user.name === user.name ||
															requisition.user.email === user.email) ? (
															<Tooltip title="Edit">
																<MenuItem
																	value="edit"
																	onClick={() => handleOpenEditModal(requisition._id)}
																>
																	<IconButton
																		onClick={() => handleOpenEditModal(requisition._id)}
																		sx={{
																			backgroundColor: "primary.main",
																			color: "#fff",
																			"&:hover": {
																				backgroundColor: "primary.dark",
																			},
																		}}
																	>
																		<SvgIcon fontSize="small">
																			<PencilSquareIcon />
																		</SvgIcon>
																	</IconButton>
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
															<Tooltip title="Print">
																<MenuItem
																	value="print"
																	onClick={() => handlePrint(requisition._id)}
																>
																	<IconButton
																		sx={{
																			backgroundColor: "success.main",
																			color: "#fff",
																			"&:hover": {
																				backgroundColor: "success.dark",
																			},
																		}}
																		onClick={() => handlePrint(requisition._id)}
																	>
																		{printLoading[requisition._id] ? (
																			<CircularProgress size={20} />
																		) : (
																			<SvgIcon fontSize="small">
																				<PrinterIcon />
																			</SvgIcon>
																		)}
																	</IconButton>
																</MenuItem>
															</Tooltip>
														) : null}

														{/* Delete condition */}
														{requisition.status !== "approved" &&
														requisition.status !== "reviewed" &&
														requisition.status !== "deleted" &&
														(requisition.user.name === user.name ||
															requisition.user.email === user.email) ? (
															<Tooltip title="Delete">
																<MenuItem
																	value="delete"
																	onClick={() => handleDeleteRequisition(requisition._id)}
																>
																	<IconButton
																		sx={{
																			backgroundColor: "error.main",
																			color: "#fff",
																			"&:hover": {
																				backgroundColor: "error.dark",
																			},
																		}}
																		onClick={() => handleDeleteRequisition(requisition._id)}
																	>
																		<SvgIcon fontSize="small">
																			<TrashIcon />
																		</SvgIcon>
																	</IconButton>
																</MenuItem>
															</Tooltip>
														) : null}
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

			<RequisitionDetailsModal
				isOpen={isReqDetailsOpen}
				requisitionId={selectedId}
				onClose={closeReqDetails}
			/>
			<CreateReqModal
				open={isEditReqModalOpen}
				onClose={handleCloseEditModal}
				triggerUpdateRequisition={updateRequisition}
				isEditMode={editMode}
				requisitionData={selectedRequisition ? selectedRequisition : null}
			/>
		</>
	);
};
