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
import { postData, uploadImages } from "src/services/helpers";
import {
  BUDGET_CODES_URL,
  PROJECTS_URL,
  REQUISITION_URL,
  UPLOAD_FILE_URL,
} from "src/services/constants";
import { formatAmount } from "src/utils/format-currency";
import { useFormik } from "formik";
import CircularProgress from "@mui/material";

const CreateReqModal = ({ open, onClose, isEditMode, requisitionData }) => {
  const auth = useAuth();
  const [part, setPart] = useState(1);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);

  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemCode, setNewItemCode] = useState("");
  const [itemsArray, setItemsArray] = useState([]);
  const [totalItemsAmount, setTotalItemsAmount] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [beneficiary, setBeneficiary] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [attentionTo, setAttentionTo] = useState("");

  // CODES
  const [projects, setProjects] = useState([]);
  const [budgetCodes, setBudgetCodes] = useState([]);

  const fetchProjects = async () => {
    const response = await axios.get(PROJECTS_URL);
    setProjects(response.data);
  };

  const fetchBudgetCodes = async () => {
    const response = await axios.get(BUDGET_CODES_URL);
    setBudgetCodes(response.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchBudgetCodes();
  }, []);

  const formik = useFormik({
    initialValues: {
      projectName: isEditMode ? requisitionData.projecName : "",
      type: isEditMode ? requisitionData.type : "",
      title: isEditMode ? requisitionData.title : "",
      currency: isEditMode ? requisitionData.currency : "NGN",
      accountName: isEditMode ? requisitionData.accountName : "",
      accountNumber: isEditMode ? requisitionData.accountNumber : "",
      bankName: isEditMode ? requisitionData.bankName : "",
      attentionTo: isEditMode ? requisitionData.attentionTo : [],
      time: new Date(),
    },
    onSubmit: async (values, helpers) => {
      try {
        // const imageUrls = await uploadImages(selectedFiles);

        const invoices = imageUrls.map((imageUrl, index) => ({
          name: selectedFiles[index].name,
          url: imageUrl,
        }));

        const formValues = {
          ...values,
          total: isEditMode ? requisitionData.total : totalItemsAmount ? totalItemsAmount : 0,
          items: isEditMode ? requisitionData.items : itemsArray,
          invoices: isEditMode ? requisitionData.invoices : invoices,
        };
        console.log("formik");
        console.log(formValues);
      } catch (error) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error.message });
        helpers.setSubmitting(false);
      } finally {
        // formik.resetForm();
        // setPart(1);
        // onClose();
      }
    },
  });

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
        `${REQUISITION_URL}/${requisitionData._id}`,
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

  const handleSubmitRequisition = async () => {
    const newRequisitionData = {
      user: {
        userId: auth.ser?._id,
        email: auth.user?.email,
        name: auth.user?.name,
        photoUrl: auth.user?.photoUrl,
        signatureUrl: auth.user?.signatureUrl,
      },
      type: reqType,
      title: reqDesc,
      receipts: [],
      items: itemsArray,
      currency: currency,
      amountInWords: "",
      total: 123,
      accountName: beneficiary?.accountName,
      accountNumber: Number(beneficiary?.accountNumber),
      bankName: beneficiary?.bankName,
      attentionTo: attentionTo,
      projectChargedTo: {
        account: {
          accountName: selectedProject.accountName,
          accountNumber: selectedProject.accountNumber,
          bankName: selectedProject.bankName,
        },
        funder: selectedProject.funder,
        projectName: selectedProject.projectName,
      },
    };

    try {
      console.info(newRequisitionData);
      // const data = await postData(REQUISITION_URL, newRequisitionData);
      // console.log(data);
    } catch (error) {
      toast.error("Error posting requisition:", error.message);
    } finally {
      setPart(1);
      // onClose();
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

  const uploadFiles = async () => {
    const formData = new FormData();
    
    try {
      setLoadingFileUpload(true);

      formData.append("destination", "invoices");

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }


      // const response = await axios.post(UPLOAD_FILE_URL, formData);
      // console.log(response.data);
    } catch (error) {
      console.error("Error uploading files:", error.message);
    } finally {
      setLoadingFileUpload(true);
      console.log(formData);
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ my: 2 }}>
        <Typography variant="title">
          {isEditMode ? "Edit Requisition" : "Create Requisition"}
        </Typography>
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
                    {...formik.getFieldProps("projectName")}
                    onChange={(e) => {
                      formik.setFieldValue("projectName", e.target.value);
                    }}
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
                    {...formik.getFieldProps("type")}
                    onChange={(e) => {
                      formik.setFieldValue("type", e.target.value);
                    }}
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
              value={formik.values.title}
              onChange={(e) => {
                formik.setFieldValue("title", e.target.value);
              }}
            />

            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Choose Currency</InputLabel>
                    <Select
                      value={formik.values.currency}
                      onChange={(e) => formik.setFieldValue("currency", e.target.value)}
                    >
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
                          budgetCode.project.includes(formik.values.projectName) ? (
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
                    {formik.values.currency}
                    &nbsp;
                    {formatAmount(Number(totalItemsAmount))}
                  </strong>
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mt: 4, borderColor: "neutral.300" }} />

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
                    onClick={uploadFiles}
                  >
                    {loadingFileUpload ? <CircularProgress size={20} /> : "Upload"}
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
          </>
        )}
        {part === 2 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Beneficiary</InputLabel>
                  <Select label="Select Beneficiary">{/* Beneficiary options */}</Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Attention to</InputLabel>
                  <Select label="Tag Users" multiple>
                    {/* Tag users options */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <>
              {beneficiary && (
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
                  <TextField fullWidth label="Bank Name" variant="outlined" margin="normal" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Account Number" variant="outlined" margin="normal" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Holder Name" variant="outlined" margin="normal" />
                </Grid>
              </Grid>
              <Button variant="outlined" color="success" size="medium">
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
              <Button onClick={() => formik.handleSubmit()} color="info" variant="contained">
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => formik.handleSubmit()} color="success" variant="contained">
                Submit Request
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateReqModal;
