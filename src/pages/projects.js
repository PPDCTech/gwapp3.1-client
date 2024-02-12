import Head from "next/head";
import { Box, Container, Stack, Typography, Tab, Tabs } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useState } from "react";
import { AccountCodesTable } from "src/sections/projects/account-codes-table";
import { BudgetCodesTable } from "src/sections/projects/budget-codes-table";
import { ProjectCodesTable } from "src/sections/projects/project-codes-table";

const Page = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Head>
        <title>Projects | Gwapp</title>
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
              <Typography variant="h5">Projects & Codes</Typography>
            </Box>
            <Box>
              <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary">
                <Tab label="Projects" />
                <Tab label="Account Codes" />
                <Tab label="Budget Codes" />
              </Tabs>
              {tabIndex === 0 && (
                <Box sx={{ mt: 2 }}>
                  <ProjectCodesTable />
                </Box>
              )}
              {tabIndex === 1 && (
                <Box sx={{ mt: 2 }}>
                  <AccountCodesTable />
                </Box>
              )}
              {tabIndex === 2 && (
                <Box sx={{ mt: 2 }}>
                  <BudgetCodesTable />
                </Box>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
