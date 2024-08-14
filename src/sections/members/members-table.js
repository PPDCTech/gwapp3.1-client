import { useState } from "react";
import PropTypes from "prop-types";
import {
	Avatar,
	Box,
	Card,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	SvgIcon,
	Tooltip,
	CircularProgress,
	Modal,
	Button,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { getInitials } from "../../utils/get-initials";
import BlockIcon from "@mui/icons-material/Block";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { USER_ACCESS_LABELS } from "../../services/constants";
import { useAuth } from "../../hooks/use-auth";

export const MembersTable = (props) => {
	const {
		count = 0,
		members = [],
		onPageChange = () => {},
		onRowsPerPageChange,
		page = 0,
		rowsPerPage = 0,
		isAlumni = false,
		onDeactivate,
		activateHandler,
		onChangeUserRoles,
		updateHandler,
	} = props;
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const [selectedRoles, setSelectedRoles] = useState([]);

	const [deactivateLoading, setDeactivateLoading] = useState({});
	const [activateLoading, setActivateLoading] = useState({});

	const possibleRoles = [
		{ label: "Super User", value: "superUser" },
		{ label: "User Manager", value: "userManager" },
		{ label: "Budget Holder", value: "budgetHolder" },
		{ label: "Finance User", value: "financeUser" },
		{ label: "Finance", value: "finance" },
		{ label: "Finance Reviewer", value: "financeReviewer" },
		{ label: "Tech", value: "tech" },
		{ label: "User", value: "user" },
	];

	const handleDeactivate = async (id) => {
		try {
			setDeactivateLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
			onDeactivate(id);
			updateHandler();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setDeactivateLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
		}
	};
	const handleActivate = async (id) => {
		try {
			setActivateLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
			await activateHandler(id);
			updateHandler();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setActivateLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
		}
	};

	const handleOpen = (userId) => {
		setOpen(true);
		setSelectedId(userId);
	};
	const handleClose = () => setOpen(false);

	const handleRoleChange = (value) => {
		setSelectedRoles((prevRoles) =>
			prevRoles.includes(value)
				? prevRoles.filter((role) => role !== value)
				: [...prevRoles, value],
		);
	};

	const submitRolesHandler = async () => {
		await onChangeUserRoles(selectedId, selectedRoles);
		updateHandler();
		handleClose();
	};

	console.log("MMM", members);

	return (
		<Card>
			<Scrollbar>
				<Box sx={{ minWidth: 800 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								{!isAlumni && (
									<>
										<TableCell>Phone</TableCell>
										<TableCell>Access Level</TableCell>
									</>
								)}
								{user &&
									user?.position.some((role) =>
										["tech", "userManager"].includes(role),
									) && <TableCell>Action</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{members.map((member) => (
								<TableRow hover key={member._id}>
									<TableCell>
										<Stack alignItems="center" direction="row" spacing={2}>
											<Avatar src={member.photoUrl || ""}>
												{getInitials(member.name)}
											</Avatar>
											<Typography variant="subtitle2">{member.name}</Typography>
										</Stack>
									</TableCell>
									<TableCell>{member.email || "N/A"}</TableCell>
									{!isAlumni && (
										<>
											<TableCell>{member.phone || "N/A"}</TableCell>
											<TableCell>
												<Typography variant="body2" component="span">
													{member.position
														.slice(0, 2)
														.map((pos) => USER_ACCESS_LABELS[pos])
														.join(", ")}
												</Typography>
											</TableCell>

											{user &&
												user?.position.some((role) =>
													["tech", "userManager"].includes(role),
												) && (
													<TableCell>
														<Stack direction="row" spacing={1}>
															<Tooltip title="Deactivate">
																<IconButton
																	onClick={() => handleDeactivate(member._id)}
																	aria-label="Preview"
																	color="error"
																	sx={{ fontSize: "1rem" }}
																	disabled={deactivateLoading[member._id]}
																>
																	{deactivateLoading[member._id] ? (
																		<CircularProgress size={14} />
																	) : (
																		<SvgIcon fontSize="small">
																			<BlockIcon />
																		</SvgIcon>
																	)}
																</IconButton>
															</Tooltip>
															<Tooltip title="Change Access" placement="left-start">
																<IconButton
																	onClick={() => handleOpen(member._id)}
																	aria-label="Preview"
																	color="success"
																	sx={{ fontSize: "1rem" }}
																>
																	<SvgIcon fontSize="small">
																		<PersonAddIcon />
																	</SvgIcon>
																</IconButton>
															</Tooltip>
														</Stack>
													</TableCell>
												)}
										</>
									)}
									{isAlumni && (
										<>
											{user &&
												user?.position.some((role) =>
													["tech", "userManagaer"].includes(role),
												) && (
													<TableCell>
														<Stack direction="row" spacing={1}>
															<Tooltip placement="left-start" title="Activate">
																<IconButton
																	onClick={() => handleActivate(member._id)}
																	aria-label="Preview"
																	color="error"
																	sx={{ fontSize: "1rem" }}
																	disabled={activateLoading[member._id]}
																>
																	{activateLoading[member._id] ? (
																		<CircularProgress size={14} />
																	) : (
																		<SvgIcon fontSize="small">
																			<AddCircleOutlineIcon />
																		</SvgIcon>
																	)}
																</IconButton>
															</Tooltip>
														</Stack>
													</TableCell>
												)}
										</>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>

					<Modal open={open} onClose={handleClose}>
						<Box
							sx={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								width: 400,
								bgcolor: "background.paper",
								boxShadow: 24,
								p: 4,
								borderRadius: 2,
							}}
						>
							<Typography variant="h6" component="h2" sx={{ mb: 2 }}>
								Select User Roles
							</Typography>
							{possibleRoles.map((role) => (
								<FormControlLabel
									sx={{ display: "block" }}
									key={role.value}
									control={
										<Checkbox
											checked={selectedRoles.includes(role.value)}
											onChange={() => handleRoleChange(role.value)}
										/>
									}
									label={role.label}
								/>
							))}
							<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
								<Button onClick={handleClose} sx={{ mr: 2 }}>
									Cancel
								</Button>
								<Button variant="contained" onClick={submitRolesHandler}>
									Save
								</Button>
							</Box>
						</Box>
					</Modal>
				</Box>
			</Scrollbar>
			<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
				<TablePagination
					component="div"
					count={count}
					onPageChange={onPageChange}
					onRowsPerPageChange={onRowsPerPageChange}
					page={page}
					rowsPerPage={rowsPerPage}
					rowsPerPageOptions={[5, 10, 25]}
				/>
			</Box>
		</Card>
	);
};

MembersTable.propTypes = {
	count: PropTypes.number,
	members: PropTypes.array,
	onPageChange: PropTypes.func,
	onRowsPerPageChange: PropTypes.func,
	page: PropTypes.number,
	rowsPerPage: PropTypes.number,
	isAlumni: PropTypes.bool,
};
