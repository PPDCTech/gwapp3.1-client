import { useState, useCallback, useEffect } from "react";
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
	TablePagination,
	Chip,
	Tooltip,
} from "@mui/material";
import { DocumentDuplicateIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getCurrencySign } from "../../utils/format-currency";
import { shortenString } from "../../utils/format-strings";
import { formatAmount, capitalizeFirstLetter } from "../../services/helpers";
import { getRequisitionById } from "../../services/api/requisition.api";
import RequisitionDetailsModal from "../../components/req-details-modal";
import CreateReqModal from "../../components/create-req";
import { STATUS_COLOR_TYPE } from "../../services/constants";

const RetirementsTable = ({
	data = [],
	reloadData,
	loading,
	page,
	limit,
	totalCount,
	onPageChange,
	onLimitChange,
	updateTableData,
}) => {
	const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedRequisition, setSelectedRequisition] = useState(null);
	const [isRetireReqModalOpen, setRetireReqModalOpen] = useState(false);
	const [retireMode, setRetireMode] = useState(false);

	useEffect(() => {
		updateTableData();
		// eslint-disable-next-line
	}, []);

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
			reloadData();
			updateTableData();
		} catch (error) {
			console.error("Error getting single requisition:", error.message);
		}
	};

	const handleCloseRetireModal = () => {
		setRetireMode(false);
		setRetireReqModalOpen(false);
		reloadData();
	};

	const handleOpenReqDetails = useCallback((id) => {
		setSelectedId(id);
		setIsReqDetailsOpen(true);
	}, []);

	const renderTableCell = (row, column) => {
		switch (column) {
			case "title":
				return (
					<Typography variant="body2">
						<div
							style={{
								position: "relative",
								display: "inline-block",
							}}
						>
							<Chip
								label={row?.type}
								style={{
									position: "absolute",
									top: "-20px",
									left: "0",
									fontSize: "10px",
									height: "18px",
									lineHeight: "18px",
								}}
							/>
							<Tooltip placement="left-start" title={row?.title}>
								<span>{shortenString(row?.title, 50)}</span>
							</Tooltip>
						</div>
					</Typography>
				);
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
				{loading && (
					<Typography sx={{ mt: 2 }}>
						<CircularProgress size={10} />
						<small>&nbsp;Loading...</small>
					</Typography>
				)}
				{!loading && data.length === 0 && (
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
				{data && data?.length > 0 && (
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
									<TableCell
										sx={{
											cursor: "pointer",
											"&:hover": {
												backgroundColor: "#F3F4F6",
												boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
											},
											paddingTop: "2rem",
										}}
										onClick={() => handleOpenReqDetails(row?._id)}
									>
										{renderTableCell(row, "title")}
									</TableCell>
									<TableCell>{renderTableCell(row, "amount")}</TableCell>
									<TableCell>{renderTableCell(row, "status")}</TableCell>
									<TableCell>{renderTableCell(row, "action")}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
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
			<RequisitionDetailsModal
				isOpen={isReqDetailsOpen}
				requisitionId={selectedId}
				onClose={closeReqDetails}
				updateTableData={updateTableData}
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
