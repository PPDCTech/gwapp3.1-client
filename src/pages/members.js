import { useCallback, useState, useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
	Box,
	Button,
	Container,
	Grid,
	Stack,
	Typography,
	Tabs,
	Tab,
} from "@mui/material";
import { MembersTable } from "../sections/members/members-table";
import { MembersSearch } from "../sections/members/members-search";
import {
	fetchAlumni,
	fetchUsers,
	deactivateUser,
	fetchSingleUser,
	changeUserRoles,
} from "../services/api/users.api";
import { toast } from "react-toastify";
import { useNProgress } from "../hooks/use-nprogress";
import AddMemberModal from "../components/add-member ";
import { useAuth } from "../hooks/use-auth";

const Members = () => {
	useNProgress();
	const auth = useAuth();
	const [user, setUser] = useState(auth?.user);

	const fetchUserData = useCallback(async () => {
		try {
			const userId = window.localStorage.getItem("gwapp_userId");
			if (userId) {
				const response = await fetchSingleUser(userId);
				setUser(response?.data);
				auth.fetchUserData();
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}, [auth]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);
	
	const [activeMembers, setActiveMembers] = useState([]);
	const [totalActive, setTotalActive] = useState(0);
	const [alumniMembers] = useState([]);
	const [totalAlumni, setTotalAlumni] = useState(0);
	const [filteredActiveMembers, setFilteredActiveMembers] = useState([]);
	const [filteredAlumniMembers, setFilteredAlumniMembers] = useState([]);

	const [isLoadingActive, setIsLoadingActive] = useState(false);
	const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);
	const [errorActive, setErrorActive] = useState(null);
	const [errorAlumni, setErrorAlumni] = useState(null);
	const [activePage, setActivePage] = useState(0);
	const [alumniPage, setAlumniPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchQuery, setSearchQuery] = useState("");
	const [tabValue, setTabValue] = useState(0);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const fetchActiveMembers = useCallback(async () => {
		try {
			const result = await fetchUsers(activePage, rowsPerPage, searchQuery);
			const { totalCount } = result.data;

			setFilteredActiveMembers(result.data.users);
			setTotalActive(totalCount);
		} catch (error) {
			setErrorActive(error.message);
		} finally {
			setIsLoadingActive(false);
		}
	}, [activePage, rowsPerPage, searchQuery]);

	const fetchAlumniMembers = useCallback(async () => {
		try {
			const result = await fetchAlumni(alumniPage, rowsPerPage, searchQuery);
			const { users, totalCount } = result.data;

			setFilteredAlumniMembers(users);
			setTotalAlumni(totalCount);
		} catch (error) {
			setErrorAlumni(error.message);
		} finally {
			setIsLoadingAlumni(false);
		}
	}, [alumniPage, rowsPerPage, searchQuery]);

	const handleActivePageChange = useCallback(
		async (event, value) => {
			setActivePage(value);
			try {
				const result = await fetchUsers(value, rowsPerPage, searchQuery);
				const { users, totalCount } = result.data;
				setFilteredActiveMembers(users);
				setTotalActive(totalCount);
			} catch (error) {
				setErrorActive(error.message);
			}
		},
		[rowsPerPage, searchQuery],
	);

	useEffect(() => {
		setIsLoadingActive(true);
		setIsLoadingAlumni(true);
		setErrorActive(null);
		setErrorAlumni(null);

		fetchActiveMembers();
		fetchAlumniMembers();
	}, [fetchActiveMembers, fetchAlumniMembers]);

	const handleAlumniPageChange = useCallback(
		async (event, value) => {
			setAlumniPage(value);
			try {
				const result = await fetchAlumni(value, rowsPerPage, searchQuery);
				const { users, totalCount } = result.data;
				setFilteredAlumniMembers(users);
				setTotalAlumni(totalCount);
			} catch (error) {
				setErrorAlumni(error.message);
			}
		},
		[rowsPerPage, searchQuery],
	);

	const handleRowsPerPageChange = useCallback((event) => {
		setRowsPerPage(event.target.value);
	}, []);

	const handleSearchInputChange = useCallback(
		(event) => {
			const query = event.target.value;
			setSearchQuery(query.toLowerCase());

			if (tabValue === 0) {
				const filteredMembers = activeMembers.filter((member) =>
					member.name.toLowerCase().includes(query.toLowerCase()),
				);
				setFilteredActiveMembers(filteredMembers);
			} else if (tabValue === 1) {
				const filteredMembers = alumniMembers.filter((member) =>
					member.name.toLowerCase().includes(query.toLowerCase()),
				);
				setFilteredAlumniMembers(filteredMembers);
			}
		},
		[tabValue, activeMembers, alumniMembers],
	);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleDeactivate = async (id) => {
		try {
			await deactivateUser(id);
			fetchActiveMembers();
			fetchAlumniMembers();
			toast.info("User has been deactivated");
		} catch (error) {
			console.error(error);
			toast.error("Failed to deactivate user");
		}
	};

	const handleActivate = async (id) => {
		try {
			await deactivateUser(id);
			fetchActiveMembers();
			fetchAlumniMembers();
			toast.info("User has been activated");
		} catch (error) {
			console.error(error);
			toast.error("Failed to activate user");
		}
	};

	const handleChangeUserRoles = async (id, newRoles) => {
		try {
			await changeUserRoles(id, newRoles);

			const user = await fetchSingleUser(id);
			const updatedUserData = user.data;

			setActiveMembers((prevMembers) =>
				prevMembers.map((member) => (member._id === id ? updatedUserData : member)),
			);
			updateHandler();

			const userRoles = newRoles.join(", ");
			toast.success(`User access changed to: ${userRoles}`);
		} catch (error) {
			console.error(error.message);
			toast.error("Failed to change user access");
		}
	};

	const updateHandler = () => {
		fetchActiveMembers();
		fetchAlumniMembers();
	};

	return (
		<>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">
					<Stack spacing={3}>
						<Grid
							item
							xs={12}
							sx={{ display: "flex", justifyContent: "space-between" }}
						>
							<Typography variant="h6">Staff Members</Typography>
							<Box>
								{user?.position?.some((role) =>
									["tech", "userManager"].includes(role),
								) && (
										<Button
											size="small"
											variant="outlined"
											color="success"
											onClick={() => setIsAddModalOpen(!isAddModalOpen)}
											sx={{ ml: 2 }}
										>
											<PersonAddIcon />
											&nbsp; New Member
										</Button>
								)}
								<AddMemberModal
									updateHandler={updateHandler}
									open={isAddModalOpen}
									onClose={() => setIsAddModalOpen(!isAddModalOpen)}
								/>
							</Box>
						</Grid>

						<MembersSearch onSearchInputChange={handleSearchInputChange} />
						<Tabs value={tabValue} onChange={handleTabChange}>
							<Tab label="Active Members" />
							<Tab label="Alumni" />
						</Tabs>
						{tabValue === 0 && (
							<MembersTable
								members={filteredActiveMembers}
								isLoading={isLoadingActive}
								error={errorActive}
								page={activePage}
								onPageChange={handleActivePageChange}
								onRowsPerPageChange={handleRowsPerPageChange}
								rowsPerPage={rowsPerPage}
								activeTab={true}
								count={totalActive}
								onDeactivate={handleDeactivate}
								setActiveMembers={setActiveMembers}
								onChangeUserRoles={handleChangeUserRoles}
								updateHandler={updateHandler}
							/>
						)}
						{tabValue === 1 && (
							<MembersTable
								members={filteredAlumniMembers}
								isLoading={isLoadingAlumni}
								error={errorAlumni}
								page={alumniPage}
								onPageChange={handleAlumniPageChange}
								onRowsPerPageChange={handleRowsPerPageChange}
								activateHandler={handleActivate}
								setActiveMembers={setActiveMembers}
								rowsPerPage={rowsPerPage}
								activeTab={false}
								isAlumni={true}
								count={totalAlumni}
								updateHandler={updateHandler}
							/>
						)}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default Members;
