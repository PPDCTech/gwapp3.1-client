import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Button, Container, Grid, Typography, Divider, Tabs, Tab } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CreateReqModal from "src/components/create-req";
import ChatModal from "src/components/chat-modal";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import RequisitionDetailsModal from "src/components/req-details-modal";
import { RequisitionTable } from "src/sections/requisitions/requisitions-table";
import { useAuth } from "src/hooks/use-auth";
import {
  getAllRequisitions,
  getAttentionedToRequisitions,
  getUserRequisitions,
} from "src/services/api/requisition.api";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Page = () => {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("myRequisitions");
  const [isCreateReqModalOpen, setCreateReqModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      let fetchedRequisitions;
      let count;
      switch (selectedTab) {
        case "myRequisitions":
          const myReqs = await getUserRequisitions(user.email);
          fetchedRequisitions = myReqs.data.requisitions;
          count = myReqs.data.totalCount;
          break;
        case "forMyAttention":
          const myAttentionReqs = await getAttentionedToRequisitions(user.email);
          fetchedRequisitions = myAttentionReqs.data.requisitions;
          count = myAttentionReqs.data.totalCount;
          break;
        case "allRequisitions":
          const allReqs = await getAllRequisitions();
          fetchedRequisitions = allReqs.data.requisitions;
          count = allReqs.data.totalCount;
          break;
        default:
          fetchedRequisitions = [];
          count = 0;
      }
      setRequisitions(fetchedRequisitions);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching requisitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [selectedTab, user.email]);

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCreateReqModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setEditMode(false);
    setCreateReqModalOpen(false);
    fetchRequisitions();
  };

  return (
    <>
      <Head>
        <title>Requisitions | Gwapp</title>
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
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" component="div" gutterBottom>
                Requisitions
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleOpenCreateModal}
              >
                Create New
              </Button>
              <CreateReqModal
                open={isCreateReqModalOpen}
                onClose={handleCloseCreateModal}
                isEditMode={editMode}
                requisitionData={selectedRequisition ? selectedRequisition : null}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              {/* Filter section */}
            </Grid>

            <Grid item xs={12}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab value="myRequisitions" label="My Requisitions" />
                <Tab value="forMyAttention" label="Requisitions for my attention" />
                <Tab value="allRequisitions" label="All Requisitions" />
              </Tabs>
              <Box>
                <RequisitionTable
                  requisitions={requisitions}
                  loading={loading}
                  totalCount={totalCount}
                  currentTab={selectedTab}
                  setRequisitions={setRequisitions}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
