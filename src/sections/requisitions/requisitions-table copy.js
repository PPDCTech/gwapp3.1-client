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
import { MenuItem, Select } from "@mui/material";

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

	// ...

	const [selectedAction, setSelectedAction] = useState("");

	// ...

	return (
		<>
			{/* ... */}
			{requisitions && requisitions.length > 0 && (
				<>
					{/* ... */}
					<TableBody>
						{requisitions.map((requisition) => (
							<TableRow key={requisition._id}>
								{/* ... */}
								<TableCell
									sx={{
										"@media (max-width: 600px)": {
											display: "none",
										},
									}}
								>
									<Select
										value={selectedAction}
										onChange={(e) => setSelectedAction(e.target.value)}
									>
										<MenuItem value="">Actions</MenuItem>
										<MenuItem
											value="chat"
											onClick={() => openChatModal(requisition._id)}
										>
											Messages
										</MenuItem>
										{requisition.status !== "reviewed" &&
										requisition.status !== "approved" &&
										user.accessLevel !== "user" &&
										user.accessLevel !== "userManager" &&
										requisition.attentionTo.includes(user.email) ? (
											<MenuItem
												value="sendBack"
												onClick={(e) => handleSendBackRequisition(e, requisition._id)}
											>
												Send Back
											</MenuItem>
										) : null}
										{requisition.status !== "reviewed" &&
										requisition.status !== "approved" &&
										requisition.status !== "deleted" &&
										(requisition.user.name === user.name ||
											requisition.user.email === user.email) ? (
											<MenuItem
												value="edit"
												onClick={() => handleOpenEditModal(requisition._id)}
											>
												Edit
											</MenuItem>
										) : null}
										{requisition.status === "approved" &&
										(requisition.user.name === user.name ||
											requisition.user.email === user.email ||
											["tech", "finance", "financeReviewer"].includes(
												user.accessLevel
											)) ? (
											<MenuItem
												value="print"
												onClick={() => handlePrint(requisition._id)}
											>
												Print
											</MenuItem>
										) : null}
										{requisition.status !== "approved" &&
										requisition.status !== "reviewed" &&
										requisition.status !== "deleted" &&
										(requisition.user.name === user.name ||
											requisition.user.email === user.email) ? (
											<MenuItem
												value="delete"
												onClick={() => handleDeleteRequisition(requisition._id)}
											>
												Delete
											</MenuItem>
										) : null}
									</Select>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</>
			)}
			{/* ... */}
		</>
	);
};
