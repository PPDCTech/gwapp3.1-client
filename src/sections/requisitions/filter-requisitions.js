import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  MenuItem,
  TextField,
  FormControl,
  Select,
  InputLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Autocomplete,
  Tooltip,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchAllUsers } from "src/services/api/users.api";
import { success } from "src/theme/colors";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { getAllApprovedRequisitions } from "src/services/api/requisition.api";
import { currentDate, getDateYearMonthDay } from "src/services/helpers";
import { CSVLink } from "react-csv";
import { useAuth } from "src/hooks/use-auth";

export const FilterRequisitions = ({ onSubmitFilters }) => {
  const [users, setUsers] = useState([]);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const csvLinkRef = useRef(null);
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    user_email: "",
    type: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const usersList = async () => {
      const response = await fetchAllUsers();
      if (response && response.data) {
        const { users } = response.data;
        setUsers(users);
      }
    };
    usersList();
  }, []);

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    try {
      setFilters({
        user_email: "",
        type: "",
        status: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    onSubmitFilters(filters);
  }, [filters, onSubmitFilters]);

  const submitFilterRequisitions = () => {
    onSubmitFilters(filters);
  };

  const handleCSVDownload = async () => {
    try {
      setDownloadingCSV(true);
      const response = await getAllApprovedRequisitions(filters);
      const { requisitions } = response.data;
      const approvedReqs = requisitions;

      if (!approvedReqs || !approvedReqs.length) {
        // Handle empty data or error
        console.info("No data available for CSV generation");
        return;
      }

      // Sort the totalApprovedReqs array based on the approvedDate property
      approvedReqs.sort((a, b) => {
        if (a.approvedDate && b.approvedDate) {
          return a.approvedDate > b.approvedDate ? 1 : a.approvedDate < b.approvedDate ? -1 : 0;
        } else if (!a.approvedDate && b.approvedDate) {
          return 1;
        } else if (a.approvedDate && !b.approvedDate) {
          return -1;
        }
        return 0;
      });

      // Calculate the maximum number of items available in any requisition data
      const max_items = Math.max(
        ...approvedReqs.map((requisitionData) => requisitionData.items.length)
      );

      // Generate the dynamic item headers based on the maximum number of items
      const item_headers = Array.from({ length: max_items }, (_, index) => ({
        label: `Item ${index + 1}`,
        key: `items.${index}`,
      }));

      // Generate the CSV data
      const csv_data = approvedReqs.map((requisition, index) => {
        const row = {
          serialNumber: index + 1,
          date: getDateYearMonthDay(requisition.approvedDate),
          title: requisition.title || "N/A",
          total: requisition.total || "N/A",
          type: requisition.type || "N/A",
          "approvedBy.name": requisition.approvedBy?.name || "N/A",
          "checkedBy.name": requisition.checkedBy?.name || "N/A",
          "holderCheck.name": requisition.holderCheck?.name || "N/A",
          "projectChargedTo.projectName": requisition.projectChargedTo?.projectName || "N/A",
          "reviewedBy.name": requisition.reviewedBy?.name || "N/A",
          "user.name": requisition.user?.name || "N/A",
          accountName: requisition.accountName || "N/A",
          accountNumber: requisition.accountNumber || "N/A",
          amountInWords: requisition.amountInWords || "N/A",
          approvedDate: requisition.approvedDate || "N/A",
          bankName: requisition.bankName || "N/A",
          currency: requisition.currency || "N/A",
          sourceAccountNumber: requisition.sourceAccountNumber || "N/A",
          sourceBankName: requisition.sourceBankName || "N/A",
        };

        // Populate the row with item data
        if (requisition.items.length) {
          requisition.items.forEach((item, index) => {
            row[`items.${index}`] = `${item.title}-${item.amount}${requisition.currency}`;
          });
        }

        // Fill remaining item headers with blank if there are no items for this row
        for (let i = requisition.items.length; i < max_items; i++) {
          row[`items.${i}`] = "";
        }

        return row;
      });

      // Combine the dynamic item headers with the rest of the headers
      const csv_headers = [
        { label: "S/N", key: "serialNumber" },
        { label: "Date approved", key: "date" },
        { label: "Title", key: "title" },
        { label: "Total", key: "total" },
        { label: "Type", key: "type" },
        { label: "Holder Check", key: "holderCheck.name" },
        { label: "Checked By", key: "checkedBy.name" },
        { label: "Reviewed By", key: "reviewedBy.name" },
        { label: "Approved By", key: "approvedBy.name" },
        { label: "Project Charged To", key: "projectChargedTo.projectName" },
        { label: "User", key: "user.name" },
        { label: "Account Name", key: "accountName" },
        { label: "Account Number", key: "accountNumber" },
        { label: "Amount in Words", key: "amountInWords" },
        { label: "Approved Date", key: "approvedDate" },
        { label: "Bank Name", key: "bankName" },
        { label: "Currency", key: "currency" },
        { label: "Source Account Number", key: "sourceAccountNumber" },
        { label: "Source Bank Name", key: "sourceBankName" },
        ...item_headers,
      ];

      setCsvData(csv_data);
      setCsvHeaders(csv_headers);

      csvLinkRef.current?.link.click();
    } catch (error) {
      console.log(error.message);
    } finally {
      setDownloadingCSV(false);
    }
  };

  return (
    <>
      <Accordion sx={{ border: `1px solid ${success.light}` }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Filter Requisitions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Tooltip title="Download Approved">
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={handleCSVDownload}
                  disabled={downloadingCSV}
                  sx={{ ml: "auto" }}
                >
                  {downloadingCSV ? (
                    <>
                      <DownloadingOutlinedIcon />
                      &nbsp;downloading..
                    </>
                  ) : (
                    <>
                      <DownloadForOfflineOutlinedIcon />
                      &nbsp;Download
                    </>
                  )}
                </Button>
              </Tooltip>
              {csvData && csvData.length > 0 && csvHeaders && csvHeaders.length > 0 && (
                <CSVLink
                  ref={csvLinkRef}
                  data={csvData}
                  headers={csvHeaders}
                  filename={`requisitions_${currentDate}.csv`}
                  // forceDownload={true}
                />
              )}
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(event) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      type: event.target.value,
                    }))
                  }
                  label="Type"
                >
                  <MenuItem value="Fund Req">Fund Requisition</MenuItem>
                  <MenuItem value="Petty Cash">Petty Cash</MenuItem>
                  <MenuItem value="reimbursement">Reimbursement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      status: event.target.value,
                    }))
                  }
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="holderCheck">Holder Checked</MenuItem>
                  <MenuItem value="checked">Finance Checked</MenuItem>
                  <MenuItem value="reviewed">Reviewed</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {user.accessLevel !== "user" && user.accessLevel !== "userManager" && (
              <Grid item xs={6} md={4}>
                <Autocomplete
                  options={users.map((user) => user.name)}
                  getOptionSelected={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField {...params} label="User" fullWidth sx={{ marginBottom: "1rem" }} />
                  )}
                  onChange={(event, value) => {
                    const selectedUser = users.find((user) => user.name === value);
                    if (selectedUser) {
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        user_email: selectedUser.email,
                      }));
                    }
                  }}
                />
              </Grid>
            )}

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
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                color="info"
                variant="outlined"
                onClick={submitFilterRequisitions}
              >
                <ManageSearchIcon />
                Search
              </Button>
              <Button
                size="small"
                sx={{ ml: 1 }}
                color="warning"
                variant="outlined"
                onClick={handleResetFilters}
              >
                <SearchOffIcon />
                Reset
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
