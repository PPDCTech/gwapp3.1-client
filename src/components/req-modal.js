import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Chip,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { XCircleIcon, TrashIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { capitalizeFirstLetter, formatNaira, getDateMDY } from "src/services/helpers";
import { useAuth } from "src/hooks/use-auth";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 5,
  overflowY: "auto",
  maxHeight: "90vh",
};

const ReqModal = (props) => {
  const { open, handleClose, id, page, onRefreshData } = props;
  const { user } = useAuth();

  const [reqData, setReqData] = useState(null);
  const [loadingReqData, setLoadingReqData] = useState(false);
  const [budgetCodes, setBudgetCodes] = useState(null);
  const [budgetLine, setBudgetLine] = useState(null);
  const [accountCodes, setAccountCodes] = useState(null);
  const [accountCode, setAccountCode] = useState({
    _id: "",
    description: "",
    value: 0,
  });
  const [projectCodes, setProjectCodes] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSendBack, setIsSendBack] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [sendingBack, setSendingBack] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    setLoadingReqData(true);

    const fetchData = async () => {
      try {
        const data = []
        // const data = await fetchSingleRequisition(id);
        setReqData(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadingReqData(false);
      }
    }

    fetchData();
  }, [open, id]);

  useEffect(() => {
    // socket.on("projects", (data: IProject[]) => {
    //     setProjectCodes(data);
    // });

    const fetchInitialProjects = async () => {
    //   const data = await fetchProjects();
      const data = [];
      setProjectCodes(data);
    }

    fetchInitialProjects();

    // return () => {
    //     socket.off("projects");
    // };
  }, [project]);

  const handleProjectChange = (_id) => {
    const selectedProject = projectCodes.find((project) => project._id === _id);
    setSelectedProject(selectedProject || null);
  };

  useEffect(() => {
    const getAccountCodes = async () => {
    //   const data = await fetchAccountCodes();
      const data = []
      setAccountCodes(data);
    };
    getAccountCodes();
  }, []);

  useEffect(() => {
    const getBudgetCodes = async () => {
      const data = [];
    //   const data = await fetchBudgetCodes();
      setBudgetCodes(data);
    };
    getBudgetCodes();
  }, []);

  function openMessageModal() {
    setIsMessageModalOpen(true);
  }

  function closeMessageModal() {
    setIsMessageModalOpen(false);
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateReqStatus(id, newStatus);
      const updatedDataItem = { ...reqData, status: newStatus };
      onRefreshData(updatedDataItem);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }

  function handleSendBackClick(id) {
    setInputPlaceholder("Enter send back reason");
    setIsSendBack(true);
  }

  function handleCancelClick(id) {
    if (
      user?.role !== "financeChecker" &&
      user?.role !== "financeReviewer" &&
      user?.accessLevel !== "financialManagement" &&
      user?.accessLevel !== "fullAccess"
    ) {
      return showToast("You are not authorized to cancel", "error");
    }
    setInputPlaceholder("Enter cancel reason");
    setIsSendBack(false);
  }

  async function handleRejection() {
    if (!message) {
      return showToast("Please enter a reason", "warning");
    }

    try {
      if (user?._id) {
        await addMessage(id, user._id, message);

        if (isSendBack) {
          handleStatusChange(id, STATUS_SENT_BACK);
        } else {
          handleStatusChange(id, STATUS_CANCEL);
        }
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setMessage("");
      setInputPlaceholder("");
    }
  }

  async function handleHolderCheck(id) {
    if (user?.role !== "budgetHolder" && user?.accessLevel !== "fullAccess") {
      return showToast("A Budget Holder must check first", "warning");
    }

    const project = selectedProject;
    const budget = budgetLine;

    if (!project || !budget) {
      return showToast("Missing codes!\nCan't mark as checked", "warning");
    }

    try {
      const holderCheck = {
        userId: user?._id,
        name: user?.name,
        signatureUrl: user?.signatureUrl,
      };

      const updateReqData = {
        projectChargedTo: project,
        budgetLine: budget,
        holderCheck: holderCheck,
      };

      await updateReq(id, updateReqData);
      await handleStatusChange(id, STATUS_BUDGET_CHECK);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }

  async function handleFinanceCheck(id) {
    if (
      user?.role !== "financeChecker" &&
      user?.accessLevel !== "financialManagement" &&
      user?.accessLevel !== "fullAccess"
    ) {
      return showToast("A Finance Checker must check first", "warning");
    }

    try {
      const checker = {
        userId: user?._id,
        name: user?.name,
        signatureUrl: user?.signatureUrl,
      };

      const updateReqData = {
        checkedBy: checker,
      };

      await updateReq(id, updateReqData);
      await handleStatusChange(id, STATUS_FINANCE_CHECK);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }
  async function handleFinanceReview(id) {
    if (
      user?.role !== "financeReviewer" &&
      user?.accessLevel !== "financialManagement" &&
      user?.accessLevel !== "fullAccess"
    ) {
      return showToast("Must be reviewed by Finance", "warning");
    }

    const code = accountCode;

    if (!code) {
      return showToast("Missing Account code!\nCan't mark as checked", "warning");
    }

    try {
      const checker = {
        userId: user?._id,
        name: user?.name,
        signatureUrl: user?.signatureUrl,
      };

      const updateReqData = {
        accountCode: code,
        reviewedBy: checker,
      };

      await updateReq(id, updateReqData);
      await handleStatusChange(id, STATUS_FINANCE_REVIEW);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }
  async function handleApprove(id) {
    if (user?.role !== "approver" && user?.accessLevel !== "fullAccess") {
      return showToast("You do not have approval access", "warning");
    }

    try {
      const checker = {
        userId: user?._id,
        name: user?.name,
        signatureUrl: user?.signatureUrl,
      };

      const updateReqData = {
        approvedBy: checker,
      };

      await updateReq(id, updateReqData);
      await handleStatusChange(id, STATUS_APPROVED);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }

  function handleMarkAsPaid(id) {
    try {
      updatePaidStatus(id);
      handleStatusChange(id, STATUS_PAID);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }
  function handleRetire(id) {
    try {
      updateRetiredStatus(id);
    } catch (error) {
      toast.error(error);
    } finally {
      handleClose();
    }
  }

  const date = reqData?.date ? getDateTime(reqData?.date) : "";
  const invoices = reqData?.invoices ? reqData?.invoices : [];

  const [receipts, setReceipts] = useState([]);

  const handleUpload = (event) => {
    const newReceipts = [...receipts];
    for (let i = 0; i < event.target.files.length; i++) {
      newReceipts.push(event.target.files[i]);
    }
    setReceipts(newReceipts);
  };

  // const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const selectedFile = event.target.files?.[0];
  //     if (!selectedFile) return;

  //     try {
  //         const formData = new FormData();
  //         formData.append("receipt", selectedFile);
  //         const response = await fetch("/api/upload", {
  //             method: "POST",
  //             body: formData,
  //         });
  //         const { filename } = await response.json();
  //         setReceipts((prevReceipts) => [...prevReceipts, filename]);
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  const removeReceipt = (index) => {
    const newReceipts = [...receipts];
    newReceipts.splice(index, 1);
    setReceipts(newReceipts);
  };

  // for modal status history table
  const statusDetails = [
    { status: "", label: "", date: null },
    // { status: "pending", label: "Not checked", date: null },
    // { status: "checked", label: "Budget holder checked", date: null },
    // { status: "verified", label: "Finance verified", date: null },
    // { status: "reviewed", label: "Finance reviewed ok", date: null },
    // { status: "approved", label: "Requisition approved", date: null },
    // { status: "sentBack", label: "Requisition sent back", date: null },
    // { status: "cancelled", label: "Requisition cancelled", date: null },
  ];

  return (
    <Modal
      open={open}
      // onClose={handleClose}
      onClose={() => {
        setSelectedProject(null);
        setAccountCode(null);
        setBudgetLine(null);
        handleClose();
      }}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <>
        {loadingReqData ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              ...style,
              width: "90%",
              maxWidth: 800,
              margin: "0 auto",
              "@media (min-width: 600px)": {
                width: "80%",
              },
              "@media (min-width: 960px)": {
                width: "60%",
              },
              padding: "34px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Requisition Details</Typography>
              <IconButton color="error"
onClick={handleClose}>
                <XCircleIcon />
              </IconButton>
            </Box>
            <hr />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ mr: 2 }}>
                <Typography variant="body1"
className="text-item-header">
                  Type
                </Typography>
                <Typography variant="subtitle1"
className="text-item">
                  {reqData?.type}
                </Typography>
              </Box>
              <Box sx={{ mr: 2 }}>
                <Typography variant="body1"
className="text-item-header">
                  Raised By
                </Typography>
                <Typography variant="subtitle1"
className="text-item">
                  {reqData?.name}
                </Typography>
              </Box>
              <Box sx={{ mr: 2 }}>
                <Typography variant="body1"
className="text-item-header">
                  Date
                </Typography>
                <Typography variant="subtitle1"
className="text-item">
                  {getDateMDY(reqData?.date)}
                </Typography>
              </Box>
            </Box>

            {/* description */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mr: 2 }}>
                <Typography variant="body1"
className="text-item-header">
                  Description
                </Typography>
                <Typography variant="subtitle1"
className="text-item">
                  {reqData?.title}
                </Typography>
                {page === "dashboard" && (
                  <Chip sx={{ mt: 1 }}
label={`status: ${reqData?.status}`}
variant="outlined" />
                )}
              </Box>
            </Box>

            {/* invoices section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1"
className="text-item-header">
                Invoice(s)
              </Typography>
              <hr />
              {invoices.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {invoices.map((invoice, index) => (
                    <a href={invoice?.url}
target="_blank"
rel="noreferrer"
key={index}>
                      <iframe
                        src={invoice?.url}
                        title={invoice?.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          marginRight: "10px",
                          scrollSnapAlign: "start",
                        }}
                      ></iframe>
                      <br />
                      {invoice?.name}
                    </a>
                  ))}
                </Box>
              ) : (
                <Typography variant="subtitle1">N/A</Typography>
              )}
              <hr />
            </Box>

            {/* items table */}
            <TableContainer sx={{ mt: 5, maxHeight: "60vh" }}>
              <Typography variant="body1"
className="text-item-header">
                Item List
              </Typography>
              <Table stickyHeader
className="reqmodal-table"
sx={{ mt: 1 }}>
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Budget Line</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="table-body">
                  {reqData?.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.title}</TableCell>
                      <TableCell>{formatNaira(item?.amount)}</TableCell>
                      <TableCell>{item?.code || "n/a"}</TableCell>
                    </TableRow>
                  ))}

                  <TableRow className="total">
                    <TableCell className="text-item-header">TOTAL</TableCell>
                    <TableCell>{formatNaira(Number(reqData?.total))}</TableCell>
                    <TableCell>{capitalizeFirstLetter(reqData?.amountInWords)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* beneficiary account details */}
            <Box sx={{ mt: 4, p: 1, border: "1px solid grey" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body1"
className="text-item-header">
                    Beneficiary
                  </Typography>
                  <Typography variant="subtitle1"
className="text-item">
                    {reqData?.accountName}
                  </Typography>
                </Box>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body1"
className="text-item-header">
                    Beneficiary Bank
                  </Typography>
                  <Typography variant="subtitle1"
className="text-item">
                    {reqData?.bankName}
                  </Typography>
                </Box>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body1"
className="text-item-header">
                    Beneficiary Account Number
                  </Typography>
                  <Typography variant="subtitle1"
className="text-item">
                    {reqData?.accountNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* budget and codes */}
            {page === "dashboard" && (
              <>
                {reqData?.status === "approved" || reqData?.status === "paid" ? null : (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body1"
className="text-item-header">
                      Select Budget code & Project
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "16px",
                        mt: 1,
                      }}
                    >
                      {/* Show budget line dropdown if user is budget holder or has full access */}
                      {isUserRole(user?.role, "budgetHolder") ||
                      isUserLevel(user?.accessLevel, "fullAccess") ? (
                        <FormControl fullWidth>
                          <InputLabel id="budget-line">Budget Line</InputLabel>
                          <Select
                            labelId="budget-line"
                            value={budgetLine ? budgetLine._id : ""}
                            label="Budget Line"
                            onChange={(e) =>
                              setBudgetLine(
                                budgetCodes?.find((code) => code._id === e.target.value) || null
                              )
                            }
                          >
                            {budgetCodes ? (
                              budgetCodes.map((code) => (
                                <MenuItem key={code._id}
value={code._id}>
                                  {code.description}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="">Loading...</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      ) : null}

                      {/* Show section if user is finance reviewer or has financial management or full access level */}
                      {isUserRole(user?.role, "financeReviewer") ||
                      isUserLevel(user?.accessLevel, "financialManagement") ||
                      isUserLevel(user?.accessLevel, "fullAccess") ? (
                        <FormControl fullWidth>
                          <InputLabel id="account-code">Account Code</InputLabel>
                          <Select
                            labelId="account-code"
                            value={accountCode ? accountCode._id : ""}
                            label="Account Code"
                            onChange={(e) => {
                              const selectedAccountId = e.target.value;
                              const selectedAccountCode = accountCodes?.find(
                                (account) => account._id === selectedAccountId
                              );
                              setAccountCode(selectedAccountCode || null);
                            }}
                          >
                            {accountCodes ? (
                              accountCodes.map((account, index) => (
                                <MenuItem key={index}
value={account._id}>
                                  {account.description}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="">Loading...</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      ) : null}

                      {/* Show project dropdown if user is budget holder or has full access */}
                      {isUserRole(user?.role, "budgetHolder") ||
                      isUserLevel(user?.accessLevel, "fullAccess") ? (
                        <FormControl fullWidth>
                          <InputLabel id="project">Project</InputLabel>
                          <Select
                            labelId="project"
                            value={budgetCodes ? project?._id : ""}
                            defaultValue=""
                            label="Project"
                            onChange={(e) => handleProjectChange(e.target.value)}
                          >
                            {projectCodes.length > 0 ? (
                              projectCodes.map((project, index) => (
                                <MenuItem key={index}
value={project?._id}>
                                  {project.projectName}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="">Loading...</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      ) : null}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* source account details */}
            <Box sx={{ mt: 2, p: 1 }}
className="light-bg-green">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body1"
className="text-item-header">
                    {page === "dashboard" ? "Source Account" : "Project"}
                  </Typography>
                  <Typography variant="subtitle1"
className="text-item">
                    {page === "dashboard"
                      ? reqData?.status === "approved" || reqData?.status === "paid"
                        ? `${reqData?.sourceBankName}`
                        : `${selectedProject?.account?.accountName}`
                      : `${reqData?.projectName}`}
                  </Typography>
                </Box>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body1"
className="text-item-header">
                    Bank
                  </Typography>
                  <Typography variant="subtitle1"
className="text-item">
                    {page === "dashboard"
                      ? reqData?.status === "approved" || reqData?.status === "paid"
                        ? `${reqData?.sourceBankName}`
                        : `${selectedProject?.account?.bankName}`
                      : `${reqData?.projectChargedTo?.account.bankName}`}
                  </Typography>
                </Box>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body1"
className="text-item-header">
                    Account Number
                  </Typography>
                  <Typography variant="subtitle1"
className="text-item">
                    {page === "dashboard"
                      ? reqData?.status === "approved" || reqData?.status === "paid"
                        ? `${reqData?.sourceAccountNumber}`
                        : `${selectedProject?.account?.accountNumber}`
                      : `${reqData?.projectChargedTo?.account.accountNumber}`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* upload receipt section */}
            {page === "dashboard" && (
              <>
                {reqData?.status !== "approved" && reqData?.status !== "paid" && (
                  <Box sx={{ mt: 4 }}>
                    <Box display="flex"
alignItems="center"
mb={1}>
                      <Typography mr={2}
variant="body1"
className="text-item-header">
                        Upload Receipts:
                      </Typography>
                      <Button
                        variant="contained"
                        component="label"
                        className="btn-type-info"
                        size="small"
                      >
                        Choose File
                        <input type="file"
onChange={handleUpload}
multiple
hidden />
                      </Button>
                    </Box>
                    {receipts.length > 0 ? (
                      <Box>
                        {receipts.map((receipt, index) => (
                          <Box
                            display="flex"
                            alignItems="center"
                            key={index}
                            mb={1}
                            sx={{
                              borderRadius: "4px",
                              border: "1px solid grey",
                              p: "10px",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>{receipt.name}</Typography>
                            <IconButton onClick={() => removeReceipt(index)}>
                              <TrashIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="subtitle1">No receipts uploaded.</Typography>
                    )}
                  </Box>
                )}
              </>
            )}

            {/* requisition actions */}
            {page === "dashboard" && (
              <Box sx={{ mt: 4 }}>
                <Divider />
                <Box sx={{ mt: 2 }}
className="row">
                  <Box className="col-md-7">
                    <TableContainer
                      component={Box}
                      className="col-md-6"
                      sx={{
                        border: "0.5px dashed lightgrey",
                        p: 1,
                      }}
                    >
                      <Typography variant="body1"
className="text-item-header">
                        Check History
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-item-header">Status</TableCell>
                            <TableCell className="text-item-header">Date Checked</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {statusDetails.map((statusDetail) => (
                            <TableRow key={statusDetail.status}>
                              <TableCell>{statusDetail.label}</TableCell>
                              <TableCell>
                                {statusDetail.date ? formatDate(statusDetail.date) : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box className="col-md-5">
                    <Typography variant="body1"
className="text-item-header">
                      Actions
                    </Typography>
                    <Box className="button-container">
                      <Button onClick={openMessageModal}
className="btn btn-type-info btn-sm">
                        Message
                      </Button>
                      <Box sx={{ mt: 2 }}>
                        {reqData?.status === "cancelled" ? (
                          "Requisition Cancelled"
                        ) : reqData?.status === "paid" ? (
                          "Payment Made"
                        ) : (
                          <>
                            {reqData?.status !== "sentBack" && reqData?._id && (
                              <Button
                                variant="contained"
                                className="btn btn-type-warning btn-sm"
                                onClick={() => handleSendBackClick(reqData._id)}
                              >
                                Send Back
                              </Button>
                            )}

                            {reqData?.status === "pending" && (
                              <Button
                                variant="contained"
                                size="large"
                                className="btn btn-type-success btn-sm"
                                onClick={() => handleHolderCheck(reqData?._id)}
                                sx={{
                                  mx: 1,
                                  mt: {
                                    xs: 1,
                                    sm: 0,
                                  },
                                }}
                              >
                                Mark as Checked
                              </Button>
                            )}
                            {reqData?.status === "holderChecked" && (
                              <Button
                                variant="contained"
                                size="large"
                                className="btn btn-type-success btn-sm"
                                onClick={() => handleFinanceCheck(reqData?._id)}
                                sx={{
                                  mx: 1,
                                  mt: {
                                    xs: 1,
                                    sm: 0,
                                  },
                                }}
                              >
                                Finance Check
                              </Button>
                            )}
                            {reqData?.status === "checked" && (
                              <Button
                                variant="contained"
                                size="large"
                                className="btn btn-type-success btn-sm"
                                onClick={() => handleFinanceReview(reqData?._id)}
                                sx={{
                                  mx: 1,
                                  mt: {
                                    xs: 1,
                                    sm: 0,
                                  },
                                }}
                              >
                                Finance Review
                              </Button>
                            )}
                            {reqData?.status === "reviewed" && (
                              <Button
                                variant="contained"
                                size="large"
                                className="btn btn-type-success btn-sm"
                                onClick={() => handleApprove(reqData?._id)}
                                sx={{
                                  mx: 1,
                                  mt: {
                                    xs: 1,
                                    sm: 0,
                                  },
                                }}
                              >
                                Approve Requisition
                              </Button>
                            )}
                            {reqData?.status === "approved" && (
                              <>
                                <Button
                                  variant="contained"
                                  size="large"
                                  className="btn btn-type-success btn-sm"
                                  onClick={() => handleMarkAsPaid(reqData?._id)}
                                  sx={{
                                    mx: 1,
                                    mt: {
                                      xs: 1,
                                      sm: 0,
                                    },
                                  }}
                                >
                                  Mark as Paid
                                </Button>
                                <Button
                                  variant="contained"
                                  disableElevation
                                  className="btn btn-type-danger btn-sm"
                                  onClick={() => handleCancelClick(reqData._id)}
                                  sx={{
                                    mt: {
                                      xs: 1,
                                      sm: 0,
                                    },
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </Box>
                      {inputPlaceholder && (
                        <TextField
                          sx={{ mt: 2 }}
                          fullWidth
                          placeholder={inputPlaceholder}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleRejection}>
                                  <PaperAirplaneIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box className="mt-2 d-flex justify-content-end">
                  <Button className="text-danger"
onClick={() => handleClose()}>
                    Close Requisition
                  </Button>
                </Box>
              </Box>
            )}

            {/* signature sections */}
            {page === "gwapplytics" && (
              <Grid container
spacing={2}
sx={{ mt: 4 }}>
                <Grid item
xs={3}>
                  <Typography variant="subtitle2"
className="text-item-header">
                    Budget Holder Check
                  </Typography>
                  <Typography variant="body1">{reqData?.holderCheck?.name}</Typography>
                </Grid>
                <Grid item
xs={3}>
                  <Typography variant="subtitle2"
className="text-item-header">
                    Finance Check
                  </Typography>
                  <Typography variant="body1">{reqData?.checkedBy?.name}</Typography>
                </Grid>
                <Grid item
xs={3}>
                  <Typography variant="subtitle2"
className="text-item-header">
                    Finance Reviewed
                  </Typography>
                  <Typography variant="body1">{reqData?.reviewedBy?.name}</Typography>
                </Grid>
                <Grid item
xs={3}>
                  <Typography variant="subtitle2"
className="text-item-header">
                    Approved By
                  </Typography>
                  <Typography variant="body1">{reqData?.approvedBy?.name}</Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </>
    </Modal>
  );
};

export default ReqModal;
