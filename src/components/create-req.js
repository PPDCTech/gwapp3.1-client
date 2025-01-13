import { useState, useEffect, useCallback } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
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
import BlockIcon from "@mui/icons-material/Block";
import { useAuth } from "../hooks/use-auth";
import { toast } from "react-toastify";
import { getCurrentDateTimeString } from "../services/helpers";
import { formatAmount } from "../utils/format-currency";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchBudgetHolders } from "../services/api/users.api";
import {
	createRequisition,
	sendForRetire,
	updateRequisition,
} from "../services/api/requisition.api";
import { getAllProjects } from "../services/api/projects.api";
import { getAllBudgetCodes } from "../services/api/budget-codes.api";
import { CheckCircleOutline } from "@mui/icons-material";
import { removeFileAPI, uploadFileAPI } from "../services/api/uploads.api";
import { addVendor, getUserVendors } from "../services/api/vendors.api";

const CreateReqModal = ({
	open,
	onClose,
	isEditMode,
	retireMode,
	requisitionData,
	triggerUpdateRequisition,
}) => {
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

	let budgetLineItems = [];
	const [itemsArray, setItemsArray] = useState([]);
	const [totalItemsAmount, setTotalItemsAmount] = useState(0);

	const [selectedFiles, setSelectedFiles] = useState([]);
	const [invoiceArray, setInvoiceArray] = useState([]);
	const [retirementFiles, setRetirementFiles] = useState([]);

	const [budgetHolders, setBudgetHolders] = useState([]);
	const [attentionTo, setAttentionTo] = useState("");

	const [beneficiaryList, setBeneficiaryList] = useState([]);
	const [beneficiaryName, setBeneficiaryName] = useState("");
	const [beneficiary, setBeneficiary] = useState({});

	const [newBankName, setNewBankName] = useState("");
	const [newAccountNumber, setNewAccountNumber] = useState("");
	const [newAccountName, setNewAccountName] = useState("");
	const [newVendorTIN, setNewVendorTIN] = useState("");
	const [newVendorBusinessName, setNewVendorBusinessName] = useState("");

	const [projects, setProjects] = useState([]);
	const [budgetCodes, setBudgetCodes] = useState([]);

	const [addingNewBeneficiary, setAddingNewBeneficiary] = useState(false);
	const [savingNewBeneficiary, setSavingNewBeneficiary] = useState(false);

	useEffect(() => {
		if (requisitionData) {
			setProjectName(
				requisitionData.projectName
					? requisitionData.projectName
					: requisitionData.projectChargedTo
					? requisitionData.projectChargedTo.projectName
					: "",
			);
			setType(requisitionData.type || "");
			setTitle(requisitionData.title || "");
			setCurrency(requisitionData.currency || "");
			setItemsArray(requisitionData.items);
			setInvoiceArray(requisitionData.invoices || "");
			setTotalItemsAmount(Number(requisitionData.total) || 0);
		}
	}, [requisitionData]);

	const fetchBenificiaries = useCallback(async () => {
		try {
			const beneficiariesResponse = await getUserVendors(user._id);
			setBeneficiaryList(beneficiariesResponse.data);
		} catch (error) {
			console.error(error);
		}
	}, [user]);

	const handleAddNewAccount = async () => {
		try {
			setSavingNewBeneficiary(true);
			const new_account = {
				bankName: newBankName,
				accountName: newAccountName,
				accountNumber: newAccountNumber,
				vendorTIN: newVendorTIN,
				vendorBusinessName: newVendorBusinessName,
				userId: user._id,
			};
			const response = await addVendor(new_account);
			fetchBenificiaries();
			toast.success("Beneficiary added, you can now select it");
			setBeneficiary({
				bankName: response.data.bankName,
				accountNumber: response.data.accountNumber,
				accountName: response.data.accountName,
				vendorTIN: response.data?.vendorTIN ? response.data?.vendorTIN : "",
				vendorBusinessName: response.data?.vendorBusinessName ? response.data?.vendorBusinessName : ""
			});
		} catch (error) {
			toast.error(`Error: ${error.message}`);
		} finally {
			setSavingNewBeneficiary(false);
		}
	};

	useEffect(() => {
		fetchBenificiaries();
	}, [fetchBenificiaries]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [budgetHoldersResponse, projectsResponse, budgetCodesResponse] =
					await Promise.all([
						fetchBudgetHolders(),
						getAllProjects(),
						getAllBudgetCodes(),
					]);

				if (budgetHoldersResponse && budgetHoldersResponse.data) {
					const { budget_holders } = budgetHoldersResponse.data;
					setBudgetHolders(budget_holders);
				}

				setProjects(projectsResponse.data);
				setBudgetCodes(budgetCodesResponse.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (newItemCode) {
			budgetLineItems.push(newItemCode);
		}
		// eslint-disable-next-line
	}, [newItemCode]);

	const resetForm = () => {
		setNewItemTitle("");
		setNewItemAmount("");
		setNewItemCode("");
		budgetLineItems = [];
		setItemsArray([]);
		setTotalItemsAmount(0);

		setSelectedFiles([]);
		setInvoiceArray([]);

		setBudgetHolders([]);
		setAttentionTo("");

		setBeneficiaryList([]);
		setBeneficiaryName("");
		setBeneficiary({});

		setNewBankName("");
		setNewAccountNumber("");
		setNewAccountName("");
		setNewVendorTIN("");
		setNewVendorBusinessName("");

		setProjects([]);
		setBudgetCodes([]);
	};

	const selectedProject = projects.find(
		(project) => project.projectName === projectName,
	);

	const [beingChargedTo, setBeingChargedTo] = useState({});

	useEffect(() => {
		if (projectName && selectedProject) {
			setBeingChargedTo({
				account: {
					accountName: selectedProject ? selectedProject.account.accountName : "",
					accountNumber: selectedProject
						? selectedProject.account.accountNumber
						: "",
					bankName: selectedProject ? selectedProject.account.bankName : "",
				},
				funder: selectedProject ? selectedProject.funder : "",
				projectName: projectName,
			});
		}
	}, [projectName, selectedProject]);

	const handleSubmitRequisition = async (event) => {
		event.preventDefault();

		try {
			setLoadingSubmit(true);
			const attentionToUser = budgetHolders.find(
				(holder) => holder.name === attentionTo,
			);

			const formValues = {
				userId: user._id,
				type,
				title,
				invoices: invoiceArray,
				items: itemsArray,
				currency,
				amountInWords: "",
				total: Number(totalItemsAmount),
				accountName: beneficiary?.accountName || newAccountName || "Nil",
				accountNumber: beneficiary?.accountNumber || newAccountNumber || "Nil",
				bankName: beneficiary?.bankName || newBankName || "Nil",
				vendorTIN: beneficiary?.vendorTIN || "",
				vendorBusinessName: newVendorBusinessName || "",
				attentionTo: attentionToUser?.email || "",
				projectChargedTo: beingChargedTo,
				budgetLineItems,
				date: getCurrentDateTimeString(),
			};

			// Validate each parameter separately
			if (!formValues.type) {
				toast.warning("Type is missing");
				return;
			}
			if (!formValues.title) {
				toast.warning("Title is missing");
				return;
			}
			if (!formValues.items || formValues.items.length < 1) {
				toast.warning("No items added");
				return;
			}
			if (!formValues.attentionTo) {
				toast.warning("Attention to is missing");
				return;
			}
			if (!selectedProject) {
				toast.warning("Please select a project");
				return;
			}

			const response = await createRequisition(formValues);
			if (response.status === 201) {
				toast.success("Request created successfully");
				onClose();
				resetForm();

				window.location.reload();
			}
		} catch (error) {
			toast.error(`Error creating request\n${error.message}`);
			console.log("Error creating request", error.message);
		} finally {
			setLoadingSubmit(false);
			setPart(1);
		}
	};

	const handleSaveEditRequisition = async (event) => {
		event.preventDefault();
		try {
			setLoadingSaveEdit(true);

			const attentionToUser = budgetHolders.find(
				(holder) => holder.name === attentionTo,
			);

			// Filter out invoices that are already in requisitionData.invoices
			const existingInvoiceNames = requisitionData.invoices.map(
				(invoice) => invoice.name,
			);

			// Filter new invoices to avoid duplicates
			const newInvoices = invoiceArray.filter(
				(invoice) => !existingInvoiceNames.includes(invoice.name),
			);

			const formValues = {
				userId: user._id,
				type: type ? type : requisitionData.type,
				title: title ? title : requisitionData.title,
				invoices: [...requisitionData.invoices, ...newInvoices],
				items: itemsArray ? itemsArray : requisitionData.itemsArray,
				currency: currency ? currency : requisitionData.currency,
				amountInWords: "",
				total: totalItemsAmount
					? Number(totalItemsAmount)
					: Number(requisitionData.totalItemsAmount) ||
					  Number(requisitionData.total),
				accountName: beneficiary?.accountName
					? beneficiary.accountName
					: newAccountName || requisitionData.accountName || "Nil",
				accountNumber: beneficiary?.accountNumber
					? beneficiary.accountNumber
					: newAccountNumber || requisitionData.accountNumber || "Nil",
				bankName: beneficiary?.bankName
					? beneficiary.bankName
					: newBankName || requisitionData.bankName || "Nil",
				vendorTIN: beneficiary?.vendorTIN
					? beneficiary.vendorTIN
					: newVendorTIN || requisitionData.vendorTIN || "",
				attentionTo: attentionToUser?.email
					? attentionToUser.email
					: requisitionData.attentionTo,
				projectChargedTo: beingChargedTo,
				date: getCurrentDateTimeString(),
			};

			// Validate each parameter separately
			if (!formValues.type) {
				toast.warning("Type is missing");
				return;
			}
			if (!formValues.title) {
				toast.warning("Title is missing");
				return;
			}
			if (!formValues.items || formValues.items.length < 1) {
				toast.warning("No items added");
				return;
			}
			if (!formValues.attentionTo) {
				toast.warning("Attention to is missing");
				return;
			}
			if (!selectedProject) {
				toast.warning("Please select a project");
				return;
			}

			const update_response = await updateRequisition(
				requisitionData._id,
				formValues,
			);

			if (update_response.status === 200) {
				toast.success("Request updated successfully");
				triggerUpdateRequisition(update_response.data);
				setPart(1);
				onClose();
				resetForm();

				window.location.reload();
			}
		} catch (error) {
			console.log("Failed to save changes", error.message);
		} finally {
			setLoadingSaveEdit(false);
		}
	};

	const handleSubmitForRetire = async (event) => {
		event.preventDefault();
		try {
			setLoadingSaveEdit(true);
			const formValues = {
				userId: user._id,
				invoices:
					requisitionData.invoices.length > 0
						? [...requisitionData.invoices, ...retirementFiles]
						: retirementFiles,
				date: getCurrentDateTimeString(),
			};

			const response = await sendForRetire(requisitionData._id, formValues);

			if (response.status === 200) {
				toast.success("Request sent for retirement");
				triggerUpdateRequisition(response.data);
				onClose();
			}
		} catch (error) {
			console.log("Failed to save changes", error.message);
		} finally {
			setLoadingSaveEdit(false);
		}
	};

	const handleNext = () => {
		if (itemsArray.length === 0) {
			return alert("Please save at least one item");
		}
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
				code: newItemCode.code,
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
		const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
		const validFiles = [];

		Array.from(files).forEach((file) => {
			if (file.size > maxFileSize) {
				alert(`The file "${file.name}" exceeds the 5MB size limit.`);
			} else {
				validFiles.push(file);
			}
		});

		if (validFiles.length > 0) {
			setSelectedFiles([...selectedFiles, ...validFiles]);
		}
	};

	const uploadFiles = async (event) => {
		event.preventDefault();

		try {
			if (!retireMode) {
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
				setSelectedFiles([]); // Clear selected files

				setFileUploadSuccess(true);

				setTimeout(() => {
					setFileUploadSuccess(false);
				}, 3000);
			} else {
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

				setRetirementFiles([...retirementFiles, ...newInvoices]);
				setSelectedFiles([]); // Clear selected files

				setFileUploadSuccess(true);

				setTimeout(() => {
					setFileUploadSuccess(false);
				}, 3000);
			}
		} catch (error) {
			toast.error("Error uploading files");
			console.log("Error uploading files:", error.message);
		} finally {
			setLoadingFileUpload(false);
		}
	};

	const handleRemoveSelectedFile = (index) => {
		const updatedFiles = [...selectedFiles];
		updatedFiles.splice(index, 1);
		setSelectedFiles(updatedFiles);
	};

	const handleRemoveFile = async (del) => {
		const redId = requisitionData ? requisitionData._id : "";
		try {
			await removeFileAPI(del.id, redId);
			if (!retireMode) {
				setInvoiceArray((prevArray) => prevArray.filter((file) => file.id !== del.id));
			} else {
				setRetirementFiles((prevArray) => prevArray.filter((file) => file.id !== del.id));
			}
		} catch (error) {
			toast.error(`Error deleting file: ${error.message}`);
			console.log("Error deleting file:", error.message);
		}
	};

	const handleOpenFile = (file) => {
		window.open(URL.createObjectURL(file));
	};
	const handleOpenInvoice = (file) => {
		window.open(file.url);
	};

	return (
		// <form onSubmit={formik.handleSubmit}>
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle sx={{ my: 2 }}>
				{isEditMode
					? "Edit Requisition"
					: retireMode
					? "Retire Requisition"
					: "Create Requisition"}
				<Typography variant="subtitle1">{`Step ${part}`}</Typography>
			</DialogTitle>
			<DialogContent>
				{part === 1 && (
					<>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<FormControl fullWidth>
									{retireMode ? (
										<TextField
											disabled
											type="text"
											value={projectName || ""}
											variant="outlined"
										/>
									) : (
										<>
											<InputLabel>Select Project</InputLabel>
											<Select
												label="Select Project"
												value={projectName}
												onChange={(e) => setProjectName(e.target.value)}
											>
												{projects.map((project, index) => (
													<MenuItem
														key={`${project._id}-${project.projectName}-${index}`}
														value={project.projectName}
													>
														{project.projectName}
													</MenuItem>
												))}
											</Select>
										</>
									)}
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									{retireMode ? (
										<TextField
											disabled
											type="text"
											value={type || ""}
											variant="outlined"
										/>
									) : (
										<>
											<InputLabel>Request Type</InputLabel>
											<Select
												label="Request Type"
												value={type}
												onChange={(e) => setType(e.target.value)}
											>
												<MenuItem value="Advance">Advance</MenuItem>
												<MenuItem value="Requisition">Requisition</MenuItem>
												<MenuItem value="Reimbursement">Reimbursement</MenuItem>
												<MenuItem value="Petty">Petty</MenuItem>
											</Select>
										</>
									)}
								</FormControl>
							</Grid>
						</Grid>
						<TextField
							multiline
							rows={2}
							fullWidth
							label="Purpose of Request (Do not include Budget Line Code here)"
							variant="outlined"
							margin="normal"
							value={title}
							disabled={retireMode}
							onChange={(e) => setTitle(e.target.value)}
						/>

						<Box sx={{ mt: 4 }}>
							<Grid container spacing={2} sx={{ mt: 1 }}>
								<Grid item xs={3}>
									<FormControl fullWidth>
										{retireMode ? null : (
											<>
												<InputLabel>Choose Currency</InputLabel>
												<Select
													value={currency}
													onChange={(e) => setCurrency(e.target.value)}
												>
													<MenuItem value="NGN">₦</MenuItem>
													<MenuItem value="USD">$</MenuItem>
												</Select>
											</>
										)}
									</FormControl>
								</Grid>
							</Grid>

							{!retireMode ? (
								<>
									<Typography sx={{ mt: 3 }} variant="subtitle2">
										Add Items
									</Typography>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6} md={4}>
											<FormControl fullWidth sx={{ mt: 1 }}>
												<Autocomplete
													fullWidth
													options={budgetCodes.filter((budgetCode) =>
														budgetCode.project.includes(projectName)
															? budgetCode
															: budgetCodes,
													)}
													getOptionLabel={(budgetCode) =>
														budgetCode
															? `${budgetCode.code}-(${budgetCode.project})-${budgetCode.description}`
															: ""
													}
													value={newItemCode}
													onChange={(event, newValue) => {
														setNewItemCode(newValue);
													}}
													renderInput={(params) => (
														<TextField {...params} label="Budget Line" fullWidth />
													)}
												/>
											</FormControl>
										</Grid>
										<Grid item xs={12} sm={6} md={4}>
											<FormControl fullWidth sx={{ mt: 1 }}>
												<TextField
													label="Describe the item"
													value={newItemTitle}
													// InputProps={{ readOnly: true }}
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

										<Grid item xs={12} sm={6} md={4} sx={{ mt: 0 }}>
											<Button
												variant="outlined"
												color="success"
												size="medium"
												onClick={handleAddItem}
											>
												Save Item
											</Button>
										</Grid>
									</Grid>
								</>
							) : null}

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
													{!retireMode && <TableCell>Action</TableCell>}
												</TableRow>
											</TableHead>
											<TableBody>
												{itemsArray.map((item, index) => (
													<TableRow key={`${item.title}-${index}`}>
														<TableCell>{item.title}</TableCell>
														<TableCell>{item.amount}</TableCell>
														<TableCell>{item.code}</TableCell>
														{!retireMode ? (
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
														) : (
															<TableCell>
																<IconButton
																	aria-label="Preview"
																	color="error"
																	disabled={true}
																	sx={{ fontSize: "1rem" }}
																>
																	<SvgIcon fontSize="small">
																		<BlockIcon />
																	</SvgIcon>
																</IconButton>
															</TableCell>
														)}
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
									Upload supporting documents:(receipts, invoices, etc)
								</Typography>
								<Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
									Please for multiple files, hold down the Ctrl/cmd key and select a
									maximum of 5 files. (We now support excel and csv files)
									<br />
									Don't forget to press the Upload button after selecting file(s).
								</Typography>{" "}
							</Grid>
							<Grid item xs={12} md={6}>
								{" "}
								<input
									type="file"
									id="fileInput"
									accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx"
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
										Upload{fileUploadSuccess ? "ed" : ""}
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
						</Grid>

						<Grid container spacing={4}>
							<Grid item xs={12} md={6}>
								{selectedFiles && selectedFiles.length > 0 && (
									<Typography variant="subtitle1" sx={{ mt: 2 }}>
										Selected Files
									</Typography>
								)}
								<List>
									{selectedFiles.map((file, index) => (
										<ListItem key={`${file.name}-${index}`} sx={{ mt: -1 }}>
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
													onClick={() => handleRemoveSelectedFile(index)}
													aria-label="Remove"
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
							<Grid item xs={12} md={6}>
								{invoiceArray && invoiceArray.length > 0 && (
									<Typography variant="subtitle1" sx={{ mt: 2 }}>
										Uploaded Files
									</Typography>
								)}
								{retireMode && (
									<List>
										{retirementFiles.map((file, index) => (
											<ListItem key={`${file.name}-${index}`} sx={{ mt: -1 }}>
												<ListItemText primary={file.name} />
												<ListItemSecondaryAction>
													<IconButton
														onClick={() => handleOpenInvoice(file)}
														aria-label="Preview"
														color="primary"
														sx={{ fontSize: "10px" }}
													>
														<SvgIcon fontSize="small">
															<EyeIcon />
														</SvgIcon>
													</IconButton>
													<IconButton
														onClick={() => handleRemoveFile(file)}
														aria-label="Delete"
														color="error"
														sx={{ fontSize: "10px" }}
													>
														<SvgIcon fontSize="small">
															<TrashIcon />
														</SvgIcon>
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
										))}
									</List>
								)}
								{retireMode && <Divider sx={{ borderColor: "neutral.300" }} />}
								<List>
									{invoiceArray.map((file, index) => (
										<ListItem key={`${file.name}-${index}`} sx={{ mt: -1 }}>
											<ListItemText primary={file.name} />
											<ListItemSecondaryAction>
												<IconButton
													onClick={() => handleOpenInvoice(file)}
													aria-label="Preview"
													color="primary"
													sx={{ fontSize: "10px" }}
												>
													<SvgIcon fontSize="small">
														<EyeIcon />
													</SvgIcon>
												</IconButton>
												{!retireMode ? (
													<IconButton
														onClick={() => handleRemoveFile(file)}
														aria-label="Delete"
														color="error"
														sx={{ fontSize: "10px" }}
													>
														<SvgIcon fontSize="small">
															<TrashIcon />
														</SvgIcon>
													</IconButton>
												) : (
													<IconButton
														disabled={true}
														aria-label="Cannot Delete"
														color="error"
														sx={{ fontSize: "10px" }}
													>
														<SvgIcon fontSize="small">
															<BlockIcon />
														</SvgIcon>
													</IconButton>
												)}
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Grid>
						</Grid>

						<Divider sx={{ my: 3, borderColor: "neutral.300" }} />

						{!retireMode && (
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6} md={6}>
									<Autocomplete
										options={beneficiaryList}
										getOptionLabel={(option) =>
											`${option.accountName} (${option.bankName})`
										}
										renderInput={(params) => (
											<TextField
												{...params}
												name="beneficiary"
												label="Select Beneficiary"
												value={beneficiaryName}
												fullWidth
												required
												sx={{ marginBottom: "1rem" }}
											/>
										)}
										onInputChange={(e, value) => {
											// Find the selected beneficiary based on the input value
											const selectedBeneficiary = beneficiaryList.find(
												(account) =>
													`${account.accountName} (${account.bankName})` === value,
											);

											setBeneficiaryName(value);

											if (selectedBeneficiary) {
												setBeneficiary(selectedBeneficiary);
											} else {
												setBeneficiary({});
											}
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={6}>
									<Autocomplete
										options={budgetHolders}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<TextField
												{...params}
												name="attentionTo"
												label="Attention To"
												value={attentionTo}
												fullWidth
												required
												sx={{ marginBottom: "1rem" }}
											/>
										)}
										onInputChange={(e, newValue) => setAttentionTo(newValue)}
									/>
								</Grid>
							</Grid>
						)}

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
										<Typography variant="subtitle1">
											TIN:&nbsp;
											<strong>
												{beneficiary.vendorTIN ? beneficiary.vendorTIN : "Nil"}
											</strong>
										</Typography>
									</div>
								)}
							{attentionTo && (
								<>
									{/* <hr /> */}
									{/* <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Attention To: <strong>{attentionTo}</strong>
                  </Typography> */}
									{/* <hr /> */}
								</>
							)}
						</>

						{/* Adding new beneficiary account */}
						{!retireMode && (
							<>
								<Divider />
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<Typography variant="subtitle2">Dont find the beneficiary?</Typography>

									<Button
										variant="text"
										color={addingNewBeneficiary ? "error" : "success"}
										onClick={() => setAddingNewBeneficiary(!addingNewBeneficiary)}
									>
										{addingNewBeneficiary ? "Close" : "Add new"}
									</Button>
								</Box>

								{addingNewBeneficiary && (
									<>
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
													value={newAccountName}
													onChange={(e) => setNewAccountName(e.target.value)}
													fullWidth
													label="Holder Name"
													variant="outlined"
													margin="normal"
												/>
											</Grid>
										</Grid>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6} md={8}>
												<TextField
													value={newVendorBusinessName}
													onChange={(e) => setNewVendorBusinessName(e.target.value)}
													fullWidth
													label="Vendor Business Name"
													variant="outlined"
													margin="normal"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={4}>
												<TextField
													value={newVendorTIN}
													onChange={(e) => setNewVendorTIN(e.target.value)}
													fullWidth
													label="Vendor TIN"
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
											disabled={savingNewBeneficiary}
										>
											{savingNewBeneficiary ? "Saving..." : "Save"}
										</Button>
									</>
								)}
							</>
						)}
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
							<Button
								disabled={loadingSaveEdit}
								color="info"
								variant="contained"
								onClick={(e) => handleSaveEditRequisition(e)}
							>
								{loadingSaveEdit ? "Saving..." : "Submit Changes"}
							</Button>
						) : retireMode ? (
							<Button
								onClick={(e) => handleSubmitForRetire(e)}
								color="success"
								variant="contained"
								disabled={loadingSaveEdit}
							>
								{loadingSaveEdit ? "Submitting..." : "Submit Request"}
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
