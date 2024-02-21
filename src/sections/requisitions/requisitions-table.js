import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  SvgIcon,
  Pagination,
  Grid,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  TrashIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PrinterIcon,
  PencilSquareIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { STATUS_COLOR_TYPE } from "src/services/constants";
import { formatAmount, getCurrencySign } from "src/utils/format-currency";
import { shortenString } from "src/utils/format-strings";
import { SeverityPill } from "src/components/severity-pill";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ChatModal from "src/components/chat-modal";
import RequisitionDetailsModal from "src/components/req-details-modal";
import ReqModal from "src/components/req-modal";
import { useAuth } from "src/hooks/use-auth";
import { deleteRequisition, destroyRequisition } from "src/services/api/requisition.api";
import { formatDate } from "src/utils/format-date";
import { getDateMDY } from "src/services/helpers";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const RequisitionTable = ({
  requisitions,
  loading,
  totalCount,
  currentTab,
  setRequisitions,
}) => {
  const { user } = useAuth();
  const [loadingRows, setLoadingRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerpage, setRowsPerpage] = useState(25);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isReqDetailsOpen, setIsReqDetailsOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerpage(parseInt(event.target.value, 25));
    setPage(1);
  };

  const openChatModal = (reqId) => {
    setSelectedId(reqId);
    setIsChatModalOpen(true);
  };
  const closeChatModal = () => {
    setSelectedId("");
    setIsChatModalOpen(false);
  };

  const openReqDetails = () => setIsReqDetailsOpen(true);

  const closeReqDetails = () => {
    setIsReqDetailsOpen(false);
    setSelectedId("");
  };

  useEffect(() => {
    if (!isReqDetailsOpen) {
      setRequisitions((prevRequisitions) => [...prevRequisitions]);
    }
  }, [isReqDetailsOpen])

  const handleOpenReqDetails = (id) => {
    setSelectedId(id);
    openReqDetails();
  };

  const handleOpenEditModal = (id) => {
    console.log(id);
    // fetch single requisition using id,
    // call open create req modal and pass the data
  };

  const handleDeleteRequisition = async (id) => {
    await deleteRequisition(id);
    setRequisitions(requisitions.filter((req) => req._id !== id));
  };

  return (
    <>
      {loading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <>
          {(!requisitions || requisitions.length === 0) && (
            <Typography sx={{ mt: 2 }}>No requisitions found.</Typography>
          )}

          {requisitions && (
            <>
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "40%" }}>Title</TableCell>
                      <TableCell sx={{ width: "15%" }}>Amount</TableCell>
                      <TableCell sx={{ width: "15%" }}>Date</TableCell>
                      <TableCell sx={{ width: "10%" }}>Status</TableCell>
                      <TableCell
                        sx={{
                          width: "20%",
                          "@media (max-width: 600px)": {
                            display: "none",
                          },
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requisitions.map((requisition) => (
                      <TableRow key={requisition._id}>
                        <TableCell
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#F3F4F6",
                              boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
                            },
                          }}
                          onClick={() => handleOpenReqDetails(requisition._id)}
                        >
                          <Tooltip title={requisition.title}>
                            {shortenString(requisition.title, 55)}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {getCurrencySign(requisition?.currency)}
                          {formatAmount(Number(requisition?.total))}
                        </TableCell>
                        <TableCell>{getDateMDY(requisition.date)}</TableCell>
                        <TableCell>
                          <SeverityPill color={STATUS_COLOR_TYPE[requisition.status || "pending"]}>
                            {requisition.status}
                          </SeverityPill>
                        </TableCell>
                        <TableCell
                          sx={{
                            "@media (max-width: 600px)": {
                              display: "none",
                            },
                          }}
                        >
                          <Grid container spacing={2}>
                            {/* Chat icon always visible */}
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

                            {/* If you are the requester, and it's not yet approved - you can delete */}
                            {requisition?.user?.name === user?.name &&
                              requisition.status !== "approved" && (
                                <>
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
                                        onClick={() => handleDeleteRequisition(requisition._id)}
                                      >
                                        <SvgIcon fontSize="small">
                                          <TrashIcon />
                                        </SvgIcon>
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                  <Grid item>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        onClick={() => handleOpenEditModal(requisition._id)}
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
                                </>
                              )}

                            {/* Will add explanation later, I don tire */}
                            {(user?.accessLevel === "budgetHolder" &&
                              requisition.status === "pending") ||
                            (user?.accessLevel === "finance" &&
                              requisition.status === "holderCheck") ||
                            (user?.accessLevel === "financeReviewer" &&
                              requisition.status === "checked") ||
                            (user?.accessLevel === "superUser" &&
                              requisition.status === "reviewed") ? (
                              <Grid item>
                                <Tooltip title="Print">
                                  <IconButton
                                    sx={{
                                      backgroundColor: "warning.main",
                                      color: "#fff",
                                      "&:hover": {
                                        backgroundColor: "warning.dark",
                                      },
                                    }}
                                  >
                                    <SvgIcon fontSize="small">
                                      <ArrowUturnLeftIcon />
                                    </SvgIcon>
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            ) : null}

                            {/* If approved, you (owner) and all accessLevels above 'user' can print */}
                            {requisition.status === "approved" && (
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
                            )}
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                count={Math.ceil(totalCount / rowsPerpage)}
                page={page}
                onChange={handleChangePage}
                rowsPerPage={rowsPerpage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <ChatModal open={isChatModalOpen} onClose={closeChatModal} reqId={selectedId} />
              <RequisitionDetailsModal
                isOpen={isReqDetailsOpen}
                onClose={closeReqDetails}
                requisitionId={selectedId}
              />
            </>
          )}
        </>
      )}
      <RequisitionDetailsModal
        isOpen={isReqDetailsOpen}
        requisitionId={selectedId}
        onClose={closeReqDetails}
      />
    </>
  );
};
