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
	Typography,
	CircularProgress,
} from "@mui/material";
import { DocumentDuplicateIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getCurrencySign } from "../../utils/format-currency";
import { formatAmount, capitalizeFirstLetter } from "../../services/helpers";
import { getRequisitionById } from "../../services/api/requisition.api";
import RequisitionDetailsModal from "../../components/req-details-modal";
import CreateReqModal from "../../components/create-req";
import { STATUS_COLOR_TYPE } from "../../services/constants";

const RetirementsTable = ({ data = [], reloadData, loading }) => {
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedRequisition, setSelectedRequisition] = useState(null);
	const [isRetireReqModalOpen, setRetireReqModalOpen] = useState(false);
	const [retireMode, setRetireMode] = useState(false);

	const closeReqDetails = () => {
		setIsReqDetailsOpen(false);
		setSelectedId(null);
	};

	const handleOpenRetireModal = async (id) => {
		try {
			const req = await getRequisitionById(id);
			setSelectedRequisition(req.data);
			setRetireMode(true);
			setRetireReqModalOpen(true);
		} catch (error) {
			console.error("Error getting single requisition:", error.message);
		}
	};

	const handleCloseRetireModal = () => {
		setRetireMode(false);
		setRetireReqModalOpen(false);
	};

	const handleOpenReqDetails = useCallback((id) => {
		setSelectedId(id);
		setIsReqDetailsOpen(true);
	}, []);

	const renderTableCell = (row, column) => {
		switch (column) {
			case "title":
				return row?.title;
			case "amount":
				return `${getCurrencySign(row?.currency)}${formatAmount(
					Number(row?.total),
				)}`;
			case "status":
				return (
					<Typography
						variant="body2"
						sx={{
							color: (theme) =>
								STATUS_COLOR_TYPE[row?.retiredStatus || "cancelled"] &&
								theme.palette.text.primary,
							backgroundColor: (theme) =>
								STATUS_COLOR_TYPE[row?.retiredStatus || "cancelled"] &&
								theme.palette[STATUS_COLOR_TYPE[row?.retiredStatus || "cancelled"]]
									.light,
							display: "inline",
							marginRight: "8px",
							padding: "4px 8px",
							borderRadius: "4px",
						}}
					>
						{capitalizeFirstLetter(row?.retiredStatus || "controlled")}
					</Typography>
				);
			case "action":
				return (
					<Box sx={{ display: "flex", gap: "10px" }}>
						<Button
							size="small"
							onClick={() => handleOpenReqDetails(row?._id)}
							variant="outlined"
							sx={{
								display: "flex",
								alignItems: "center",
								color: "text.primary",
								borderColor: "text.primary",
								"&:hover": {
									borderColor: "primary.main",
									color: "primary.main",
								},
							}}
						>
							<EyeIcon style={{ width: 16, height: 16, marginRight: 5 }} />
							View
						</Button>
						<Button
							size="small"
							onClick={() => handleOpenRetireModal(row?._id)}
							variant="contained"
							sx={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "primary.main",
								color: "white",
								"&:hover": {
									backgroundColor: "primary.dark",
								},
							}}
						>
							<DocumentDuplicateIcon
								style={{ width: 16, height: 16, marginRight: 5 }}
							/>
							Request
						</Button>
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<TableContainer component={Paper}>
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
						{data.length === 0 ? (
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
						) : (
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ width: "40%" }}>Title</TableCell>
										<TableCell sx={{ width: "20%" }}>Amount</TableCell>
										<TableCell sx={{ width: "20%" }}>Status</TableCell>
										<TableCell sx={{ width: "20%" }}>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data.map((row) => (
										<TableRow key={row?._id}>
											<TableCell>{renderTableCell(row, "title")}</TableCell>
											<TableCell>{renderTableCell(row, "amount")}</TableCell>
											<TableCell>{renderTableCell(row, "status")}</TableCell>
											<TableCell>{renderTableCell(row, "action")}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</>
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
				requisitionData={selectedRequisition}
			/>
		</>
	);
};

RetirementsTable.propTypes = {
	data: PropTypes.array.isRequired,
	reloadData: PropTypes.func.isRequired,
};

export default RetirementsTable;
