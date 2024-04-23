import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
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
  searchFilterRequisitions,
} from "src/services/api/requisition.api";
import { FilterRequisitions } from "src/sections/requisitions/filter-requisitions";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Warning } from "@mui/icons-material";
import { CustomTab } from "src/components/CustomTab";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Page = () => {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState([]);
  const [filteredRequisitions, setFilteredRequisitions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [isCreateReqModalOpen, setCreateReqModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (["user", "staff", "tech"].includes(user.accessLevel)) {
      setSelectedTab("myRequisitions");
    } else {
      setSelectedTab("forMyAttention");
    }
  }, [user]);


  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    try {
      setFilteredRequisitions([]);
      let fetchedRequisitions;
      let count;

      switch (selectedTab) {
        case "myRequisitions":
          fetchedRequisitions = [];
          const myReqs = await getUserRequisitions(user?._id);
          fetchedRequisitions = myReqs.data.requisitions;
          count = myReqs.data.totalCount;
          break;
        case "forMyAttention":
          fetchedRequisitions = [];
          const myAttentionReqs = await getAttentionedToRequisitions(user?.email);
          fetchedRequisitions = myAttentionReqs.data.requisitions;
          count = myAttentionReqs.data.totalCount;
          break;
        case "allRequisitions":
          fetchedRequisitions = [];
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
  }, [selectedTab, user]);

  useEffect(() => {
    fetchRequisitions();
  }, [selectedTab, user, fetchRequisitions]);

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCreateReqModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setEditMode(false);
    setCreateReqModalOpen(false);
    fetchRequisitions();
  };

  const handleSubmitFilter = async (filters) => {
    const { user_email, type, status, startDate, endDate } = filters;

    if (user_email !== "" || type !== "" || status !== "" || startDate !== "" || endDate !== "") {
      const response = await searchFilterRequisitions(filters);
      setFilteredRequisitions(response.data.requisitions);
    } else {
      setFilteredRequisitions([]);
    }
  };

  const handleEditRequisition = (editedRequisition) => {
    const updatedRequisitions = requisitions.map((req) =>
      req._id === editedRequisition._id ? editedRequisition : req
    );
    setRequisitions(updatedRequisitions);
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
              <Box>
                {["user", "staff", "tech"].includes(user.accessLevel) && (
                  <>
                    {user?.signatureUrl ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={handleOpenCreateModal}
                        sx={{ ml: 2 }}
                      >
                        <CreateNewFolderIcon />
                        &nbsp; Create New
                      </Button>
                    ) : (
                      <Button href="/profile" startIcon={<Warning />} color="warning">
                        Upload your Signature to raise request
                      </Button>
                    )}
                  </>
                )}
              </Box>
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
              <FilterRequisitions onSubmitFilters={handleSubmitFilter} />
            </Grid>

            <Grid item xs={12}>
              <div style={{ display: "flex" }}>
                {["user", "staff", "tech"].includes(user.accessLevel) && (
                  <CustomTab
                    isActive={selectedTab === "myRequisitions"}
                    value="myRequisitions"
                    onClick={() => handleTabChange("myRequisitions")}
                    label="My Requisitions"
                  />
                )}
                {user.accessLevel !== "user" && (
                  <CustomTab
                    isActive={selectedTab === "forMyAttention"}
                    value="forMyAttention"
                    onClick={() => handleTabChange("forMyAttention")}
                    label="Requisitions for my attention"
                  />
                )}
                {user.accessLevel !== "user" && user.accessLevel !== "budgetHolder" && (
                  <CustomTab
                    isActive={selectedTab === "allRequisitions"}
                    value="allRequisitions"
                    onClick={() => handleTabChange("allRequisitions")}
                    label="All Requisitions"
                  />
                )}
              </div>
              <RequisitionTable
                requisitions={
                  // requisitions
                  filteredRequisitions.length > 0 ? filteredRequisitions : requisitions
                }
                loading={loading}
                totalCount={totalCount}
                currentTab={selectedTab}
                setRequisitions={setRequisitions}
                onEditRequisition={handleEditRequisition}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
