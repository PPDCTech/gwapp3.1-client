import { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchAllUsers } from "../../services/api/users.api";
import { success } from "../../theme/colors";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
	getApprovedForPrint,
	searchFilterRequisitions,
} from "../../services/api/requisition.api";
import { currentDate } from "../../services/helpers";
import { useAuth } from "../../hooks/use-auth";

export const FilterRequisitions = ({
	setFilteredRequisitions,
	filteredPage,
	filteredLimit,
	setFilteredTotalCount,
	setLoading,
}) => {
	const [users, setUsers] = useState([]);
	const [downloadingCSV, setDownloadingCSV] = useState(false);
	const [fetchingForDownload, setFetchingForDownload] = useState(false);
	const { user } = useAuth();

	const [filters, setFilters] = useState({
		user_email: "",
		type: "",
		status: "",
		startDate: "",
		endDate: "",
		retiredStatus: "",
		serialNumber: "",
	});

	const handleSubmitFilter = useCallback(async () => {
		setLoading(true);
		const {
			user_email,
			type,
			status,
			startDate,
			endDate,
			retiredStatus,
			serialNumber,
		} = filters;

		if (
			user_email ||
			type ||
			status ||
			startDate ||
			endDate ||
			retiredStatus ||
			serialNumber
		) {
			const response = await searchFilterRequisitions(
				filters,
				filteredPage,
				filteredLimit,
			);
			setFilteredRequisitions(response.data.requisitions);
			setFilteredTotalCount(response.data.totalCount);
			setLoading(false);
		} else {
			setFilteredRequisitions([]);
			setLoading(false);
		}
	}, [filters, filteredPage, filteredLimit, setFilteredRequisitions, setFilteredTotalCount, setLoading]);

	useEffect(() => {
		const usersList = async () => {
			const response = await fetchAllUsers();
			if (response && response.data) {
				setUsers(response.data.users);
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
		setFilters({
			user_email: "",
			type: "",
			status: "",
			startDate: "",
			endDate: "",
			retiredStatus: "",
			serialNumber: "",
		});
	};

	useEffect(() => {
		handleSubmitFilter();
	}, [handleSubmitFilter]);

	const handleCSVDownload = async () => {
		try {
			setFetchingForDownload(true);

			const cast_filter = { ...filters };
			// Filter out empty filter values
			const activeFilters = Object.keys(cast_filter).reduce((acc, key) => {
				if (filters[key]) {
					acc[key] = filters[key];
				}
				return acc;
			}, {});

			const response = await getApprovedForPrint(activeFilters);

			// Create a blob object from the response data
			const blob = new Blob([response.data], { type: "text/csv" });

			// Create a URL for the blob object
			const url = window.URL.createObjectURL(blob);

			// Create a temporary anchor element
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `approved_requisitions-${currentDate}.csv`);

			// Append the anchor element to the body
			document.body.appendChild(link);

			// Programmatically click the anchor to trigger the download
			link.click();

			// Clean up: remove the anchor from the DOM
			document.body.removeChild(link);

			setDownloadingCSV(false);
			setFetchingForDownload(false);
		} catch (error) {
			toast.error("An error occurred. Please try again.");
			setDownloadingCSV(false);
			setFetchingForDownload(false);
			console.log(error.message);
		} finally {
			setDownloadingCSV(false);
		}
	};

	return (
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
								<MenuItem value="Advance">Advance</MenuItem>
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
								renderInput={(params) => (
									<TextField
										{...params}
										label="User"
										fullWidth
										sx={{ marginBottom: "1rem" }}
									/>
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
							InputLabelProps={{ shrink: true }}
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
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
					<Grid item xs={6} md={4}>
						<TextField
							fullWidth
							type="text"
							label="Serial Number"
							name="serialNumber"
							value={filters.serialNumber}
							onChange={handleChangeFilter}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
					<Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center" }}>
						<Button
							size="small"
							color="info"
							variant="contained"
							onClick={handleSubmitFilter}
						>
							<ManageSearchIcon />
							Search
						</Button>
						<Button
							size="small"
							sx={{ ml: 1 }}
							color="warning"
							variant="contained"
							onClick={handleResetFilters}
						>
							<SearchOffIcon />
							Reset
						</Button>
					</Grid>
					<Grid item xs={6} md={9} sx={{ display: "flex", justifyContent: "end" }}>
						<Tooltip title="Download Approved Requests">
							<Button
								size="small"
								variant="outlined"
								color="success"
								onClick={handleCSVDownload}
								disabled={fetchingForDownload || downloadingCSV}
								sx={{ ml: "auto" }}
							>
								{fetchingForDownload && <>fetching..</>}
								{!fetchingForDownload && (
									<>
										{downloadingCSV ? (
											<>
												<DownloadingOutlinedIcon />
												downloading..
											</>
										) : (
											<>
												<DownloadForOfflineOutlinedIcon />
												Download
											</>
										)}
									</>
								)}
							</Button>
						</Tooltip>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
};
