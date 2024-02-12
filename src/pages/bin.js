import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import BinRequisitions from "src/sections/requisitions/bin-table";

const Page = () => {
  return (
    <>
      <Head>
        <title>Bin | Gwapp</title>
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
            <Box>
              <Typography color="error" variant="h6">
                Requisitions set for deletion
              </Typography>
            </Box>
            <Box>
              <BinRequisitions />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
