import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestRequests } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { OverviewTotalRaised } from "src/sections/overview/overview-total-raised";
import { OverviewTotalApproved } from "src/sections/overview/overview-total-approved";
import { useAuth } from "src/hooks/use-auth";
import { useEffect, useState } from "react";
import { getUserRequisitions } from "src/services/api/requisition.api";

const Page = () => {
  const { user } = useAuth();
  const [totalCount, setTotalCount] = useState(0);
  const [requisitions, setRequisitions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserRequisitions(user.email);
        const { requisitions, totalCount } = response.data;
        setTotalCount(totalCount);
        setRequisitions(requisitions.slice(0, 6));
      } catch (error) {
        console.error("Error fetching requisitions:", error.message);
      }
    };
    if (user.email) {
      fetchData();
    }
  }, [user.email]);

  return (
    <>
      <Head>
        <title>User | Overview</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={4}>
              <OverviewTotalRaised positive sx={{ height: "100%" }} value={`${totalCount}`} />
            </Grid>
            {/* <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalApproved
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value={`${totalCount}`}
              />
            </Grid> */}
            <Grid xs={12} sm={6} lg={4}>
              <OverviewTasksProgress sx={{ height: "100%" }} totalValue={totalCount} />
            </Grid>
            <Grid xs={12} md={12} lg={12}>
              {/* if user is not user or tech, this will have latest approved instead */}
              <OverviewLatestRequests latestReqs={requisitions} sx={{ height: "100%" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
