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
	Box,
	MenuItem,
	MenuList,
	ListItemIcon,
	ListItemText,
	Select,
	Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
	ChatBubbleOvalLeftEllipsisIcon,
	PencilSquareIcon,
	EyeIcon,
} from "@heroicons/react/24/outline";
import { STATUS_COLOR_TYPE } from "../../services/constants";
import { formatAmount, getCurrencySign } from "../../utils/format-currency";
import { shortenString } from "../../utils/format-strings";
import { SeverityPill } from "../../components/severity-pill";

import ChatModal from "../../components/chat-modal";
import RequisitionDetailsModal from "../../components/req-details-modal";
import { markAsRetired } from "../../services/api/requisition.api";
import { getDateMDY } from "../../services/helpers";
import { toast } from "react-toastify";
import AlertModal from "../../components/alert-modal";

export const FinanceRetirementTable = ({
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
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const [itemId, setItemId] = useState("");
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);

	const [rlertModalOpen, setRlertModalOpen] = useState(false);

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

	const markAsRetiredHandler = async () => {
		try {
			const res = await markAsRetired(itemId);
			if (res.status === 200) {
				updateTableData();
				toast.success("Requisition marked as retired.");
				setRlertModalOpen(false);
			}
		} catch (error) {
			console.log("Error marking requisition as retired:", error.message);
			toast.error("An error occurred. Please try again.");
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
					{(!requisitions || requisitions?.length === 0) && (
						<Typography sx={{ mt: 2 }}>No retirement request yet 😃!</Typography>
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
															color={
																STATUS_COLOR_TYPE[requisition?.retiredStatus || "controlled"]
															}
														>
															{requisition?.retiredStatus}
														</SeverityPill>
													</TableCell>

													{/* Action column */}
													<TableCell className="animated-border">
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
																	<MenuItem
																		onClick={() => handleOpenReqDetails(requisition?._id)}
																	>
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

																<Tooltip placement="left-start" title="Sign">
																	<MenuItem
																		value="Mark as Retired"
																		onClick={() => {
																			setItemId(requisition?._id);
																			setRlertModalOpen(true);
																		}}
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

			<RequisitionDetailsModal
				isOpen={isReqDetailsOpen}
				requisitionId={selectedId}
				onClose={closeReqDetails}
			/>
		</>
	);
};
