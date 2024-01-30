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
import { GET_USER_REQUISITIONS } from "src/services/constants";
import axios from "axios";
import { useEffect, useState } from "react";

const now = new Date();

const Page = () => {
  const [total, setTotal] = useState(0);
  const [latestReqs, setLatestReqs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(GET_USER_REQUISITIONS("sadiq@ppdc.org"));
      const { requisitions, totalCount } = response.data;
      setTotal(totalCount);
      setLatestReqs(requisitions.slice(0, 6));
      
    }
    fetchData();
  }, []);


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
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalRaised
                negative
                sx={{ height: "100%" }}
                value={`${total}`}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalApproved
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value={`${total}`}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={100} />
            </Grid>
            <Grid xs={12} md={12} lg={12}>
              <OverviewLatestRequests latestReqs={latestReqs} sx={{ height: "100%" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    console.log('fetching...')
    const response = await axios.get(GET_USER_REQUISITIONS("sadiq@ppdc.org"));
    const { requisitions, totalCount } = response.data;

    return {
      props: {
        totalCount,
        requisitions
      },
    };
  } catch (error) {
    console.error("Error fetching requisitions:", error.message);

    return {
      props: {
        requisitions: [],
      },
    };
  }
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
