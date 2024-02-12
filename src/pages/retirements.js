import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getUserUnretiredRequisitions } from "src/services/api/requisition.api";
import { useEffect, useState } from "react";
import RetirementsTable from "src/sections/requisitions/retirements-table";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const [data, setData] = useState([]);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const response = await getUserUnretiredRequisitions(user.email);
      const { requisitions } = response.data;
      setData(requisitions);
    } catch (error) {
      console.error("Error fetching unretired requisitions:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Retirements | Gwapp</title>
      </Head>
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
            <RetirementsTable data={data} 
            reloadData={fetchData} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
