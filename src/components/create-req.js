import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Autocomplete,
} from "@mui/material";
import DocumentArrowUpIcon from "@heroicons/react/24/outline/DocumentArrowUpIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import XCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import { SvgIcon } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import { getCurrentDateTimeString, uploadImages } from "src/services/helpers";
import { formatAmount } from "src/utils/format-currency";
import { useFormik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchBudgetHolders } from "src/services/api/users.api";
import { addAccount, getAllAccounts } from "src/services/api/accounts.api";
import { createRequisition } from "src/services/api/requisition.api";
import { getAllProjects } from "src/services/api/projects.api";
import { getAllBudgetCodes } from "src/services/api/budget-codes.api";
import { CheckIcon } from "@heroicons/react/24/outline";
import { CheckCircleOutline } from "@mui/icons-material";
import { uploadFileAPI } from "src/services/api/uploads.api";

const CreateReqModal = ({ open, onClose, isEditMode, requisitionData }) => {
  const { user } = useAuth();
  const [part, setPart] = useState(1);

  // INITIAL FORM
  const [projectName, setProjectName] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("NGN");
  // OTHERS
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSaveEdit, setLoadingSaveEdit] = useState(false);

  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemCode, setNewItemCode] = useState("");
  const [itemsArray, setItemsArray] = useState([]);
  const [totalItemsAmount, setTotalItemsAmount] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [invoiceArray, setInvoiceArray] = useState([]);

  const [budgetHolders, setBudgetHolders] = useState([]);
  const [attentionTo, setAttentionTo] = useState("");

  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiary, setBeneficiary] = useState({});

  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newHolderName, setNewHolderName] = useState("");

  // CODES
  const [projects, setProjects] = useState([]);
  const [budgetCodes, setBudgetCodes] = useState([]);

  useEffect(() => {
    if (requisitionData) {
      setProjectName(requisitionData.projectName || requisitionData.projectChargedTo.projectName || "");
      setType(requisitionData.type || "");
      setTitle(requisitionData.title || "");
      setCurrency(requisitionData.currency || "");
      setItemsArray(requisitionData.items);
      setInvoiceArray(requisitionData.invoices || "");
      setTotalItemsAmount(Number(requisitionData.total) || 0);
    }
  }, [requisitionData]);

  const handleAddNewAccount = async () => {
    try {
      const new_account = {
        bankName: newBankName,
        accountName: newHolderName,
        accountNumber: newAccountNumber,
      };
      const response = await addAccount(new_account);
      if (response.status === 201) {
        toast.success("Account added successfully");
        setBeneficiary({
          bankName: response.data.bankName,
          accountNumber: response.data.accountNumber,
          holderName: response.data.holderName,
        });
      }
    } catch (error) {
      console.error("Error adding new account:", error.message);
    }
  };

  const getBudgetHolders = async () => {
    const response = await fetchBudgetHolders();
    if (response && response.data) {
      const { budget_holders } = response.data;
      setBudgetHolders(budget_holders);
    }
  };

  const getBeneficiaries = async () => {
    const response = await getAllAccounts();
    setBeneficiaryList(response.data);
  };

  const geProjects = async () => {
    const response = await getAllProjects();
    setProjects(response.data);
  };

  const getBudgetCodes = async () => {
    const response = await getAllBudgetCodes();
    setBudgetCodes(response.data);
  };

  const getRequisitionDataForEdit = async (reqId) => {
    if (!requisitionData) {
      return;
    }
    console.log(reqId);
  };

  useEffect(() => {
    getBudgetHolders();
    getBeneficiaries();
    geProjects();
    getBudgetCodes();
    getRequisitionDataForEdit();
  }, []);

  const handleEditRequisition = async () => {
    try {
      const updatedRequisitionData = {
        // Update the requisition data with the modified values
        project,
        type: reqType,
        title: reqDesc,
        items: itemsArray,
        // ... other properties
      };

      // Perform the update operation using the updatedRequisitionData
      const response = await axios.put(
        `${REQUISITION_API}/${requisitionData._id}`,
        updatedRequisitionData
      );

      // Handle the response, e.g., show a success message
      console.log("Requisition updated successfully:", response.data);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error updating requisition:", error.message);
    } finally {
      onClose();
    }
  };

  const handleSubmitRequisition = async (event) => {
    event.preventDefault();
    setLoadingSubmit(true);
    try {
      const selectedProject = projects.find((project) => project.projectName === projectName);
      const attentionToUser = budgetHolders.find((holder) => holder.name === attentionTo);

      const formValues = {
        userId: user._id,
        type,
        title,
        invoices: invoiceArray,
        items: itemsArray,
        currency,
        amountInWords: "",
        total: Number(totalItemsAmount),
        accountName: beneficiary?.accountName,
        accountNumber: Number(beneficiary?.accountNumber),
        bankName: beneficiary?.bankName,
        attentionTo: attentionToUser.email,
        projectChargedTo: {
          account: {
            accountName: selectedProject ? selectedProject.account.accountName : "",
            accountNumber: selectedProject ? selectedProject.account.accountNumber : "",
            bankName: selectedProject ? selectedProject.account.bankName : "",
          },
          funder: selectedProject ? selectedProject.funder : "",
          projectName: projectName,
        },
        date: getCurrentDateTimeString(),
      };

      const response = await createRequisition(formValues);
      console.log(response);
    } catch (error) {
      toast.error("Error posting request:", error);
      console.log(error.message);
    } finally {
      setLoadingSubmit(false);
      setPart(1);
      onClose();
    }
  };

  const handleNext = () => {
    setPart(part + 1);
  };

  const handleBack = () => {
    setPart(part - 1);
  };

  const handleCancel = () => {
    onClose();
    setPart(1);
  };

  const handleAddItem = () => {
    try {
      const newItemData = {
        title: newItemTitle,
        amount: newItemAmount,
        code: newItemCode,
      };

      let totalAmount = Number(totalItemsAmount) || 0;

      if (newItemData.title && newItemData.amount) {
        setItemsArray([...itemsArray, newItemData]);

        totalAmount = totalAmount + Number(newItemAmount);

        setTotalItemsAmount(totalAmount);
        setNewItemTitle("");
        setNewItemAmount("");
        setNewItemCode("");
      }
    } catch (error) {
      toast.error("Failed to add item", error.message);
    }
  };

  const handleRemoveItem = (index) => {
    if (index >= 0 && index < itemsArray.length) {
      const removedItem = itemsArray[index];
      const newTotalAmount = Number(totalItemsAmount) - Number(removedItem.amount);

      const updatedItems = [...itemsArray];
      updatedItems.splice(index, 1);
      setItemsArray(updatedItems);
      setTotalItemsAmount(newTotalAmount);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...Array.from(files)]);
  };

  const uploadFiles = async (event) => {
    event.preventDefault();

    try {
      setLoadingFileUpload(true);

      const formData = new FormData();
      const newInvoices = [];

      formData.append("destination", "invoices");

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
        newInvoices.push({ name: selectedFiles[i].name });
      }

      const response = await uploadFileAPI(formData);
      const { imageUrls } = await response.data;

      for (let i = 0; i < imageUrls.length; i++) {
        newInvoices[i].url = imageUrls[i].imageUrl;
        newInvoices[i].id = imageUrls[i].public_id;
      }

      setInvoiceArray([...invoiceArray, ...newInvoices]);

      setFileUploadSuccess(true);

      setTimeout(() => {
        setFileUploadSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error("Error uploading files");
      console.log("Error uploading files:", error.message);
    } finally {
      setLoadingFileUpload(false);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleOpenFile = (file) => {
    window.open(URL.createObjectURL(file));
  };

  return (
    // <form onSubmit={formik.handleSubmit}>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ my: 2 }}>
        {isEditMode ? "Edit Requisition" : "Create Requisition"}
        <Typography variant="subtitle1">{`Step ${part}`}</Typography>
      </DialogTitle>
      <DialogContent>
        {part === 1 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Project</InputLabel>
                  <Select
                    label="Select Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project.projectName}>
                        {project.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Request Type</InputLabel>

                  <Select
                    label="Request Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value="Fund Req">Fund Request</MenuItem>
                    <MenuItem value="Petty Cash">Petty Cash</MenuItem>
                    <MenuItem value="Reimbursement">Reimbursement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Choose Currency</InputLabel>
                    <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <MenuItem value="NGN">₦</MenuItem>
                      <MenuItem value="USD">$</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography sx={{ mt: 3 }} variant="subtitle2">
                Add Items
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <TextField
                      label="Enter desc"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <TextField
                      label="Enter amount"
                      type="number"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="budget-line">Budget Line</InputLabel>
                    <Select
                      labelId="budget-line"
                      value={newItemCode}
                      onChange={(e) => setNewItemCode(e.target.value)}
                      label="Budget Line"
                      sx={{
                        minWidth: "220px",
                        maxWidth: "220px",
                      }}
                    >
                      {budgetCodes &&
                        budgetCodes.map((budgetCode, index) =>
                          budgetCode.project.includes(projectName) ? (
                            <MenuItem key={index} value={budgetCode.code}>
                              {budgetCode.description}
                            </MenuItem>
                          ) : null
                        )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ mt: 0 }}>
                  <Button variant="outlined" color="success" size="medium" onClick={handleAddItem}>
                    Add
                  </Button>
                </Grid>
              </Grid>

              {itemsArray.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Items List
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Budget Line</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itemsArray.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleRemoveItem(index)}
                                aria-label="Preview"
                                color="error"
                                sx={{ fontSize: "1rem" }}
                              >
                                <SvgIcon fontSize="small">
                                  <TrashIcon />
                                </SvgIcon>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography>
                  <strong>
                    Total amount:&nbsp;
                    {currency}
                    &nbsp;
                    {formatAmount(Number(totalItemsAmount))}
                  </strong>
                </Typography>
              </Grid>
            </Grid>
          </>
        )}

        {part === 2 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Upload receipts
                </Typography>
                <input
                  type="file"
                  id="fileInput"
                  accept=".jpg, .jpeg, .png, .pdf"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="fileInput">
                  <Button
                    variant="outlined"
                    component="span"
                    color="success"
                    startIcon={<DocumentArrowUpIcon />}
                    sx={{ mt: 2 }}
                  >
                    Select File(s)
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 2, ml: 1 }}
                    disabled={loadingFileUpload || selectedFiles.length === 0}
                    onClick={(e) => uploadFiles(e)}
                  >
                    Upload
                    {loadingFileUpload && (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "green",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                    &nbsp;
                    {fileUploadSuccess && <CheckCircleOutline />}
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Uploads
                </Typography>
                <List sx={{ mt: 2 }}>
                  {selectedFiles.map((file, index) => (
                    <ListItem key={index} sx={{ mt: -1 }}>
                      <ListItemText primary={file.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleOpenFile(file)}
                          aria-label="Preview"
                          color="primary"
                          sx={{ fontSize: "10px" }}
                        >
                          <SvgIcon fontSize="small">
                            <EyeIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton
                          onClick={() => handleRemoveFile(index)}
                          aria-label="Delete"
                          color="error"
                          sx={{ fontSize: "10px" }}
                        >
                          <SvgIcon fontSize="small">
                            <XCircleIcon />
                          </SvgIcon>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: "neutral.300" }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  options={beneficiaryList.map((holder) => holder.accountName)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="beneficiary"
                      label="Select Beneficiary"
                      value={beneficiaryName}
                      // onSelect={(e, value) => {
                      //   setBeneficiaryName(value);
                      //   setBeneficiary(
                      //     beneficiaryList.find((account) => account.accountName === value) || {}
                      //   );
                      //   console.log("b::", beneficiary);
                      // }}
                      fullWidth
                      required
                      sx={{ marginBottom: "1rem" }}
                    />
                  )}
                  onInputChange={(e, value) => {
                    setBeneficiaryName(e.target.value);
                    setBeneficiary(
                      beneficiaryList.find((account) => account.accountName === value) || {}
                    );
                    console.log("b::2", beneficiary);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  options={budgetHolders.map((holder) => holder.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="attentionTo"
                      label="Attention To"
                      value={attentionTo}
                      onSelect={(e) => setAttentionTo(e.target.value)}
                      fullWidth
                      required
                      sx={{ marginBottom: "1rem" }}
                    />
                  )}
                  onInputChange={(e) => setAttentionTo(e.target.value)}
                />
              </Grid>
            </Grid>

            <>
              {beneficiary &&
                beneficiary.accountName &&
                beneficiary.accountNumber &&
                beneficiary.bankName && (
                  <div>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Holder:&nbsp;
                      <strong>{beneficiary.accountName}</strong>
                    </Typography>
                    <Typography variant="subtitle1">
                      Account Number:&nbsp;
                      <strong>{beneficiary.accountNumber}</strong>
                    </Typography>
                    <Typography variant="subtitle1">
                      Bank:&nbsp;
                      <strong>{beneficiary.bankName}</strong>
                    </Typography>
                  </div>
                )}
              {attentionTo && (
                <>
                  <hr />
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Attention To: <strong>{attentionTo}</strong>
                  </Typography>
                  <hr />
                </>
              )}
            </>

            <>
              <Typography variant="subtitle2" sx={{ mt: 4 }}>
                Dont find the beneficiary? add new
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    fullWidth
                    label="Bank Name"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    value={newAccountNumber}
                    onChange={(e) => setNewAccountNumber(e.target.value)}
                    fullWidth
                    label="Account Number"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    value={newHolderName}
                    onChange={(e) => setNewHolderName(e.target.value)}
                    fullWidth
                    label="Holder Name"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Button
                onClick={handleAddNewAccount}
                variant="outlined"
                color="success"
                size="medium"
              >
                Add
              </Button>
            </>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {part === 1 && (
          <>
            <Button onClick={handleCancel} color="error">
              Cancel
            </Button>
            <Button onClick={handleNext} color="info" variant="contained">
              Next
            </Button>
          </>
        )}
        {part === 2 && (
          <>
            <Button onClick={handleCancel} color="error">
              Cancel
            </Button>
            <Button onClick={handleBack} color="warning" variant="contained">
              Back
            </Button>
            {isEditMode ? (
              <Button disabled={loadingSaveEdit} color="info" variant="contained">
                {loadingSaveEdit ? "Saving.." : "Save Changes"}
              </Button>
            ) : (
              <Button
                onClick={(e) => handleSubmitRequisition(e)}
                color="success"
                variant="contained"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
    // </form>
  );
};

export default CreateReqModal;
