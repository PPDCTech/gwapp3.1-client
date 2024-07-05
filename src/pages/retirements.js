import { Box, Container, Stack, Typography } from "@mui/material";
import { getUserUnretiredRequisitions } from "../services/api/requisition.api";
import { useEffect, useState, useCallback } from "react";
import RetirementsTable from "../sections/requisitions/retirements-table";
import { useAuth } from "../hooks/use-auth";
import { useNProgress } from "../hooks/use-nprogress";

const Retirements = () => {
	useNProgress();

	const [data, setData] = useState([]);
		const [loading, setLoading] = useState(false);

	const { user } = useAuth();

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getUserUnretiredRequisitions(user?.email);
			const { requisitions } = response.data;
			setData(requisitions);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Error fetching unretired requisitions:", error.message);
		}
	}, [user]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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
						<RetirementsTable data={data} reloadData={fetchData} loading={loading} />
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default Retirements;
