import { useState } from "react";
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
} from "@mui/material";
import { getCurrencySign } from "../../utils/format-currency";
import { formatAmount } from "../../services/helpers";
import { markAsRetired } from "../../services/api/requisition.api";

const RetirementsTable = ({ data = [], reloadData }) => {
	const [page] = useState(0);
	const [rowsPerPage] = useState(10);
	const [loadingIds, setLoadingIds] = useState([]);

	const handleClick = async (id) => {
		setLoadingIds((prevLoadingIds) => [...prevLoadingIds, id]);
		try {
			await markAsRetired(id);
			reloadData();
		} catch (error) {
			console.error("Error marking requisition as retired:", error);
		} finally {
			setLoadingIds((prevLoadingIds) =>
				prevLoadingIds.filter((loadingId) => loadingId !== id),
			);
		}
	};

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	return (
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
								<TableCell>
									<Button
										size="small"
										color="success"
										onClick={() => handleClick(row._id)}
										variant="contained"
										disabled={loadingIds.includes(row._id)}
									>
										{loadingIds.includes(row._id) ? "Retiring..." : "Mark as retired"}
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
	);
};

RetirementsTable.propTypes = {
	data: PropTypes.array.isRequired,
	reloadData: PropTypes.func.isRequired,
};

export default RetirementsTable;
