import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { DocumentDuplicateIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getCurrencySign } from "../../utils/format-currency";
import { formatAmount } from "../../services/helpers";
import { getRequisitionById } from "../../services/api/requisition.api";
import RequisitionDetailsModal from "../../components/req-details-modal";
import CreateReqModal from "../../components/create-req";

const RetirementsTable = ({ data = [], reloadData }) => {
	const [page] = useState(0);
	const [rowsPerPage] = useState(10);
	// const [loadingIds, setLoadingIds] = useState([]);
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedRequisition, setSelectedRequisition] = useState(null);
	const [isRetireReqModalOpen, setRetireReqModalOpen] = useState(false);
	const [retireMode, setRetireMode] = useState(false);

	const closeReqDetails = () => {
		setIsReqDetailsOpen(false);
		setSelectedId("");
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
	const handleCloseRetireModal = () => {
		setRetireMode(false);
		setRetireReqModalOpen(false);
	};

	const openReqDetails = () => setIsReqDetailsOpen(true);

	const handleOpenReqDetails = useCallback((id) => {
		setSelectedId(id);
		openReqDetails();
	}, []);

	// const handleClick = async (id) => {
	// 	setLoadingIds((prevLoadingIds) => [...prevLoadingIds, id]);
	// 	try {
	// 		await markAsRetired(id);
	// 		reloadData();
	// 	} catch (error) {
	// 		console.error("Error marking requisition as retired:", error);
	// 	} finally {
	// 		setLoadingIds((prevLoadingIds) =>
	// 			prevLoadingIds.filter((loadingId) => loadingId !== id),
	// 		);
	// 	}
	// };

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	return (
		<>
			<TableContainer component={Paper}>
				{data.length === 0 && (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}
					>
						<Box sx={{ mt: 2 }}>You have no pending retirements 😃!</Box>
					</Box>
				)}
				{data.length > 0 && (
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ width: "60%" }}>Title</TableCell>
								<TableCell sx={{ width: "20%" }}>Amount</TableCell>
								<TableCell sx={{ width: "20%" }}>Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(rowsPerPage > 0
								? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								: data
							).map((row) => (
								<TableRow key={row._id}>
									<TableCell>{row.title}</TableCell>
									<TableCell>
										{getCurrencySign(row?.currency)}
										{formatAmount(Number(row?.total))}
									</TableCell>
									<TableCell sx={{ display: "flex", gap: "8px" }}>
										<Button
											size="small"
											color="default"
											onClick={() => handleOpenReqDetails(row._id)}
											variant="contained"
										>
											<ListItemIcon sx={{ width: "16px", height: "16px" }}>
												<EyeIcon />
											</ListItemIcon>
											<ListItemText
												primaryTypographyProps={{ fontSize: "small" }}
												primary="View Details"
											/>
										</Button>
										<Button
											size="small"
											color="primary"
											onClick={() => handleOpenRetireModal(row._id)}
											variant="contained"
										>
											<ListItemIcon sx={{ width: "16px", height: "16px" }}>
												<DocumentDuplicateIcon />
											</ListItemIcon>
											<ListItemText
												primaryTypographyProps={{ fontSize: "small" }}
												primary="Request Retire"
											/>
										</Button>
									</TableCell>
								</TableRow>
							))}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={3} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				)}
			</TableContainer>
			<RequisitionDetailsModal
				isOpen={isReqDetailsOpen}
				requisitionId={selectedId}
				onClose={closeReqDetails}
			/>
			<CreateReqModal
				open={isRetireReqModalOpen}
				retireMode={retireMode}
				onClose={handleCloseRetireModal}
				triggerUpdateRequisition={reloadData}
				isEditMode={false}
				requisitionData={selectedRequisition ? selectedRequisition : null}
			/>
		</>
	);
};

RetirementsTable.propTypes = {
	data: PropTypes.array.isRequired,
	reloadData: PropTypes.func.isRequired,
};

export default RetirementsTable;
