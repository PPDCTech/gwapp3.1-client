import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  SvgIcon,
  Select,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CreateReqModal from "src/components/create-req";
import {
  TrashIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PrinterIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { GET_USER_REQUISITIONS, STATUS_COLOR_TYPE } from "src/services/constants";
import EditReqModal from "src/components/edit-req";
import { formatDate } from "src/utils/format-date";
import { formatAmount, getCurrencySign } from "src/utils/format-currency";
import { shortenString } from "src/utils/format-strings";
import ChatModal from "src/components/chat-modal";
import { printDocument } from "src/utils/print-document";
import { fetchSingleRequisition } from "src/services/api";
import { SeverityPill } from "src/components/severity-pill";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ReqModal from "src/components/req-modal";
import RequisitionDetailsModal from "src/components/req-details-modal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Page = ({ requisitions = [] }) => {
  const [isCreateReqModalOpen, setCreateReqModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const [loadingRows, setLoadingRows] = useState([]);
  const [isDownloading, setIsDownloading] = useState([]);

  const [thisPage, setThisPage] = useState("");
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState({
    title: "",
    userName: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      title: "",
      userName: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const filterRequisitions = () => {
    try {
      // get the filters
      // pass them to endpoint to return filtered reqs
      // setReqs to the filtered reqs
      console.log(filters);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const filteredRequisitions = requisitions.filter((requisition) => {
    // return (
    //   requisition.title.toLowerCase().includes(filters.title.toLowerCase()) &&
    //   requisition.user.name.toLowerCase().includes(filters.userName.toLowerCase()) &&
    //   (filters.status === "" || requisition.status === filters.status) &&
    //   (!filters.startDate || new Date(requisition.date) >= new Date(filters.startDate)) &&
    //   (!filters.endDate || new Date(requisition.date) <= new Date(filters.endDate))
    // );
  });

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCreateReqModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setEditMode(false);
    setCreateReqModalOpen(false);
  };

  const handleOpenEditModal = (requisition) => {
    setSelectedRequisition(requisition);
    setEditMode(true);
    setCreateReqModalOpen(true);
  };

  // const handleCloseEditModal = () => {
  //   setSelectedRequisition(null);
  //   setEditModalOpen(false);
  // };

  // const handleSaveEdit = (editedRequisition) => {
  //   // Call an API to update the requisition with the edited data
  //   // You can add the logic here to update the requisition in the database
  //   // and then update the state to trigger a refresh
  //   // For demonstration, just updating the state here without an API call
  //   setRequisitions((prevRequisitions) =>
  //     prevRequisitions.map((req) => (req.id === editedRequisition.id ? editedRequisition : req))
  //   );
  // };

  const openChatModal = (id) => {
    setSelectedId(id);
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => setIsChatModalOpen(false);

  const handlePrint = async (event, requisitionId) => {
    event.stopPropagation();
    try {
      setLoadingRows((prevLoading) => [...prevLoading, requisitionId]);

      const reqItem = await fetchSingleRequisition(requisitionId);
      const doc = await printDocument(reqItem);

      pdfMake.createPdf(doc).getBlob((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");
      });

      // pdfMake.createPdf(doc).open();

      setIsDownloading((prevLoading) => [...prevLoading, requisitionId]);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsDownloading((prevLoading) => prevLoading.filter((id) => id !== requisitionId));
      }, 2000);

      setTimeout(() => {
        setLoadingRows((prevLoading) => prevLoading.filter((id) => id !== requisitionId));
      }, 3500);
    }
  };

  const handleOpenReqDetails = (id) => {
    setSelectedId(id);
    setIsReqDetailsOpen(true);
  };

  const closeReqDetails = () => {
    setSelectedId("");
    setIsReqDetailsOpen(false);
  };

  return (
    <>
      <Head>
        <title>Gwapp | Requisitions</title>
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
            <Grid item xs={12}>
              <Typography variant="h5" component="div" gutterBottom>
                Requisitions
              </Typography>
              <Button variant="outlined" color="success" onClick={handleOpenCreateModal}>
                Create New
              </Button>
              <CreateReqModal
                open={isCreateReqModalOpen}
                onClose={handleCloseCreateModal}
                isEditMode={editMode}
                requisitionData={selectedRequisition}
              />
            </Grid>


            {/* Filter section */}
            <Grid item xs={12}>
              <Accordion sx={{ border: "0.2px solid #F0FDF9"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Search Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Filter components go here */}
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                      <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={filters.title}
                        onChange={handleChangeFilter}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        fullWidth
                        label="User Name"
                        name="userName"
                        value={filters.userName}
                        onChange={handleChangeFilter}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Select
                        fullWidth
                        label="Status"
                        name="status"
                        value={filters.status}
                        onChange={handleChangeFilter}
                      >
                        <MenuItem value="">All</MenuItem>
                        {/* Add other status options */}
                      </Select>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChangeFilter}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChangeFilter}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button color="info" variant="outlined" onClick={filterRequisitions}>
                        Search
                      </Button>
                      <Button sx={{ ml: 2 }} color="warning" variant="outlined" onClick={handleResetFilters}>
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requisitions.map((requisition) => (
                      <TableRow key={requisition.id}>
                        <TableCell
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "success.lightest",
                            },
                          }}
                          onClick={() => handleOpenReqDetails(requisition._id)}
                        >
                          <Tooltip title={requisition.title}>
                            <>{shortenString(requisition.title, 55)}</>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {getCurrencySign(requisition?.currency)}
                          {formatAmount(Number(requisition?.total))}
                        </TableCell>
                        <TableCell>{formatDate(requisition.date)}</TableCell>
                        <TableCell>
                          <SeverityPill color={STATUS_COLOR_TYPE[requisition.status]}>
                            {requisition.status}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <Grid container spacing={2}>
                            {/* Change this to "pending" */}
                            {requisition.status === "approved" && (
                              <Grid item>
                                <Tooltip title="Edit">
                                  <IconButton
                                    onClick={() => handleOpenEditModal(requisition)}
                                    sx={{
                                      backgroundColor: "warning.main",
                                      color: "#fff",
                                      "&:hover": {
                                        backgroundColor: "warning.dark",
                                      },
                                    }}
                                  >
                                    <SvgIcon fontSize="small">
                                      <PencilSquareIcon />
                                    </SvgIcon>
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            )}
                            <Grid item>
                              <Tooltip title="Messages">
                                <IconButton
                                  sx={{
                                    backgroundColor: "info.main",
                                    color: "#fff",
                                    "&:hover": {
                                      backgroundColor: "info.dark",
                                    },
                                  }}
                                  onClick={() => openChatModal(requisition._id)}
                                >
                                  <SvgIcon fontSize="small">
                                    <ChatBubbleOvalLeftEllipsisIcon />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            {requisition.status === "approved" ? (
                              <Grid item>
                                <Tooltip title="Print">
                                  <IconButton
                                    sx={{
                                      backgroundColor: "success.main",
                                      color: "#fff",
                                      "&:hover": {
                                        backgroundColor: "success.dark",
                                      },
                                    }}
                                    onClick={(e) => handlePrint(e, requisition._id)}
                                  >
                                    {loadingRows.includes(requisition._id) ? (
                                      <CircularProgress size={20} color="inherit" />
                                    ) : (
                                      <SvgIcon fontSize="small">
                                        <PrinterIcon />
                                      </SvgIcon>
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            ) : (
                              <Grid item>
                                <Tooltip title="Delete">
                                  <IconButton
                                    sx={{
                                      backgroundColor: "error.main",
                                      color: "#fff",
                                      "&:hover": {
                                        backgroundColor: "error.dark",
                                      },
                                    }}
                                  >
                                    <SvgIcon fontSize="small">
                                      <TrashIcon />
                                    </SvgIcon>
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            )}
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <ChatModal open={isChatModalOpen} onClose={closeChatModal} reqId={selectedId} />
      <RequisitionDetailsModal
        isOpen={isReqDetailsOpen}
        onClose={closeReqDetails}
        requisitionId={selectedId}
      />
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await axios.get(GET_USER_REQUISITIONS("nnenna@ppdc.org"));
    const { requisitions } = response.data;

    return {
      props: {
        requisitions,
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
