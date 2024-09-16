// import { subDays, subHours } from "date-fns";
// import { OverviewBudget } from "../sections/overview/overview-budget";
// import { OverviewLatestProducts } from "../sections/overview/overview-latest-products";
// import { OverviewSales } from "../sections/overview/overview-sales";
// import { OverviewTotalCustomers } from "../sections/overview/overview-total-customers";
// import { OverviewTotalProfit } from "../sections/overview/overview-total-profit";
// import { OverviewTraffic } from "../sections/overview/overview-traffic";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { OverviewLatestRequests } from "../sections/overview/overview-latest-orders";
import { OverviewTasksProgress } from "../sections/overview/overview-tasks-progress";

import { OverviewTotalRaised } from "../sections/overview/overview-total-raised";
import { OverviewTotalApproved } from "../sections/overview/overview-total-approved";
import { useAuth } from "../hooks/use-auth";
import { useEffect, useState } from "react";
import { getUserRequisitions } from "../services/api/requisition.api";
import { useNProgress } from "../hooks/use-nprogress";

const Overview = () => {
	useNProgress();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [requisitions, setRequisitions] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [amounts, setAmounts] = useState();
	const [totalApproved, setTotalApproved] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (user && user.email) {
					const response = await getUserRequisitions(user?._id);
					const { requisitions, totalCount, totalAmount, totalApproved } =
						response.data;
					setTotalCount(totalCount);
					setRequisitions(requisitions.slice(0, 6));
					setAmounts(totalAmount);
					setTotalApproved(totalApproved);
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching requisitions:", error.message);
				setLoading(false);
			}
		};
		if (user && user?.email) {
			fetchData();
		}
	}, [user, user?.email]);

	return (
		<>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">
					<Grid container spacing={3}>
						<Grid xs={12} sm={6} lg={3}>
							<OverviewTotalRaised
								positive
								sx={{ height: "100%" }}
								value={`${totalCount}`}
							/>
						</Grid>
						<Grid xs={12} sm={6} lg={4}>
							<OverviewTotalApproved
								difference={16}
								positive={false}
								sx={{ height: "100%" }}
								value={`${totalCount}`}
								amounts={amounts}
								totalApproved={totalApproved}
							/>
						</Grid>
						<Grid xs={12} sm={6} lg={4}>
							<OverviewTasksProgress sx={{ height: "100%" }} totalValue={totalCount} />
						</Grid>
						<Grid xs={12} md={12} lg={12}>
							{/* if user is not user or tech, this will have latest approved instead */}
							<OverviewLatestRequests
								latestReqs={requisitions}
								sx={{ height: "100%" }}
								loading={loading}
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

export default Overview;
