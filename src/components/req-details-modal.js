import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Grid,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Divider,
  IconButton,
  SvgIcon,
} from "@mui/material";
import {
  capitalizeFirstLetter,
  currencyCodes,
  fetchData,
  formatAmount,
  getDateForPrintSpace,
} from "src/services/helpers";
import accounting from "accounting";
import { DocumentIcon, ChevronDownIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EMPTY_REQ_VALUES, REQUISITION_URL } from "src/services/constants";
import { useAuth } from "src/hooks/use-auth";

const RequisitionDetailsModal = ({ isOpen, onClose, requisitionId }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedText, setExpandedText] = useState("View");
  const [requisition, setRequisition] = useState(EMPTY_REQ_VALUES);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequisitionDetails = async () => {
      try {
        const requisitionData = await fetchData(`${REQUISITION_URL}/${requisitionId}`);
        setRequisition(requisitionData);
      } catch (error) {
        console.error("Error fetching requisition details:", error);
      }
    };

    if (isOpen && requisitionId) {
      fetchRequisitionDetails();
    }
  }, [isOpen, requisitionId]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
    expandedText === "View" ? setExpandedText("Close") : setExpandedText("View");
  };

  const renderCheckRow = (status, checkedBy) => {
    return (
      <TableRow key={status}>
        <TableCell>{status}</TableCell>
        <TableCell>{checkedBy.name}</TableCell>
      </TableRow>
    );
  };

  const isImage = (url) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const extension = url.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper
        style={{
          maxWidth: "60%",
          margin: "auto",
          marginTop: "50px",
          padding: "20px",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between " }}>
          <Typography variant="h6">Requisition Details</Typography>
          <IconButton color="error" onClick={onClose}>
            <SvgIcon fontSize="medium">
              <XCircleIcon />
            </SvgIcon>
          </IconButton>
        </Box>
        <Grid container spacing={3} padding={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Type</Typography>
            <Typography variant="h6">{requisition.type}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Raised By</Typography>
            <Typography variant="h6">{requisition.user.name}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Date</Typography>
            <Typography variant="h6">{getDateForPrintSpace(requisition.date)}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 1, borderColor: "neutral.300" }} />

        <Grid container spacing={3} padding={2}>
          {/* Description */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <Typography variant="body1">{requisition.title}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body1">{capitalizeFirstLetter(requisition.status)}</Typography>
          </Grid>

          {/* Check history */}
          <Grid item xs={8}>
            <Accordion expanded={expanded} onChange={handleAccordionChange}>
              <AccordionSummary
                expandIcon={<ChevronDownIcon className="h-6 w-6 text-gray-500" />}
                aria-controls="check-history-content"
              >
                <Typography variant="subtitle2">{expandedText} Status History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requisition.holderCheck &&
                        renderCheckRow("Checked", requisition.holderCheck)}
                      {requisition.checkedBy &&
                        renderCheckRow("Finance Check", requisition.checkedBy)}
                      {requisition.reviewedBy &&
                        renderCheckRow("Finance Review", requisition.reviewedBy)}
                      {requisition.approvedBy && renderCheckRow("Approved", requisition.approvedBy)}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Item List */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Items List</Typography>

            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Budget Code</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requisition.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{formatAmount(item.amount)}</TableCell>
                      <TableCell>{item.code}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Total</Typography>
              <Typography variant="body2">
                <strong>
                  {accounting.formatMoney(requisition.total, currencyCodes[requisition.currency])}
                </strong>
              </Typography>
            </Box>
          </Grid>

          {/* Invoices */}
          <Grid item xs={12}>
            <Typography variant="subtitle2">Invoices</Typography>
            <Grid container spacing={2}>
              {requisition.invoices.map((invoice, index) => (
                <Grid item key={index}>
                  {isImage(invoice.url) ? (
                    <img
                      src={invoice.url}
                      alt={invoice.name}
                      style={{ width: "100px", height: "100px", cursor: "pointer" }}
                      onClick={() => window.open(invoice.url, "_blank")}
                    />
                  ) : (
                    <div
                      style={{
                        width: "fit-content",
                        height: "fit-content",
                        padding: "5px",
                        backgroundColor: "#E5E7EB",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={() => window.open(invoice.url, "_blank")}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D2D6DB")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
                    >
                      <DocumentIcon style={{ height: 24, width: 24 }} />
                      <Typography variant="caption">{invoice.name}</Typography>
                    </div>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1, borderColor: "neutral.300" }} />

        <Grid container spacing={2} padding={2}>
          {/* Beneficiary Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Beneficiary Details:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Bank</Typography>
            <Typography variant="body1">{requisition.bankName}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Account Holder</Typography>
            <Typography variant="body1">{requisition.accountName}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Account Number</Typography>
            <Typography variant="body1">{requisition.accountNumber}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: "neutral.300" }} />
          </Grid>

          {/* Project Account Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Project Charged to: <strong>{requisition.projectChargedTo.projectName}</strong>
            </Typography>
          </Grid>
        </Grid>

        {!(user.role === "staff" || user.role === "user") && (
          <Grid container space={2} padding={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle2">Bank</Typography>
              <Typography variant="body1">
                {requisition.projectChargedTo.account.bankName}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2">Holder</Typography>
              <Typography variant="body1">
                {requisition.projectChargedTo.account.accountName}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2">Account Number</Typography>
              <Typography variant="body1">
                {requisition.projectChargedTo.account.accountNumber}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Modal>
  );
};

export default RequisitionDetailsModal;
