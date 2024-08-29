import { Box, Container, Stack, Typography } from "@mui/material";
import {
	getUserUnretiredRequisitions,
	getAllRequestedRetirements,
} from "../services/api/requisition.api";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import RetirementsTable from "../sections/requisitions/retirements-table";
import { useAuth } from "../hooks/use-auth";
import { useNProgress } from "../hooks/use-nprogress";
import { FinanceRetirementTable } from "../sections/requisitions/finance-retirement-table";

const Retirements = () => {
	useNProgress();
	const { user } = useAuth();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);

	const reqId = queryParams.get("id");
	const action = queryParams.get("action");

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [requisitions, setRequisitions] = useState([]);
	const [fetching, setFetching] = useState(false);
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [_page, _setPage] = useState(0);
	const [_limit, _setLimit] = useState(10);
	const [_totalCount, _setTotalCount] = useState(0);

	const fetchRequisitions = useCallback(async () => {
		setFetching(true);
		try {
			const response = await getAllRequestedRetirements(_page, _limit);
			const { requisitions, totalCount } = response.data;
			setRequisitions(requisitions);
			_setTotalCount(totalCount);
			setFetching(false);
		} catch (error) {
			setFetching(false);
			console.error("Error fetching retirements:", error.message);
		}
	}, [_page, _limit]);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getUserUnretiredRequisitions(
				user?.email,
				page,
				limit,
			);
			const { requisitions, totalCount } = response.data;
			setData(requisitions);
			setTotalCount(totalCount);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Error fetching unretired requisitions:", error.message);
		}
	}, [user?.email, page, limit]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		fetchRequisitions();
	}, [fetchRequisitions]);

	const _handlePageChange = (event, newPage) => {
		_setPage(newPage);
	};

	const _handleLimitChange = (event) => {
		_setLimit(parseInt(event.target.value, 10));
		_setPage(0);
	};
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="lg">
					<Stack spacing={3}>
						<Typography variant="h5">Retirements</Typography>
						<>
							{user?.position?.some((role) =>
								["financeUser", "financeReviewer", "finance"].includes(role),
							) ? (
								<FinanceRetirementTable
									requisitions={requisitions}
									updateTableData={fetchRequisitions}
									loading={fetching}
									page={_page}
									limit={_limit}
									onLimitChange={_handleLimitChange}
									onPageChange={_handlePageChange}
									totalCount={_totalCount}
									reqId={reqId}
									action={action}
								/>
							) : (
								<RetirementsTable
									data={data}
									reloadData={fetchData}
									loading={loading}
									page={page}
									limit={limit}
									onLimitChange={handleLimitChange}
									onPageChange={handlePageChange}
									totalCount={totalCount}
									updateTableData={fetchRequisitions}
								/>
							)}
						</>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default Retirements;
