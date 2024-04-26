import { useCallback, useState, useEffect } from "react";
import { Box, Container, Stack, Typography, Tabs, Tab } from "@mui/material";
import { MembersTable } from "../sections/members/members-table";
import { MembersSearch } from "../sections/members/members-search";
import {
	fetchAlumni,
	fetchUsers,
	deactivateUser,
	changeUserAccess,
	fetchSingleUser,
} from "../services/api/users.api";
import { toast } from "react-toastify";
import { useNProgress } from "../hooks/use-nprogress";

const Members = () => {
	    useNProgress();

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
	console.log(searchQuery)
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		setIsLoadingActive(true);
		setIsLoadingAlumni(true);
		setErrorActive(null);
		setErrorAlumni(null);

		fetchActiveMembers(activePage, rowsPerPage);
		fetchAlumniMembers(alumniPage, rowsPerPage);
	}, [activePage, alumniPage, rowsPerPage]);

	const fetchActiveMembers = async (page, rowsPerPage) => {
		try {
			const result = await fetchUsers(page, rowsPerPage);
			const { users, totalCount } = result.data;

			setFilteredActiveMembers(users);
			setTotalActive(totalCount);
		} catch (error) {
			setErrorActive(error.message);
		} finally {
			setIsLoadingActive(false);
		}
	};

	const fetchAlumniMembers = async (page, rowsPerPage) => {
		try {
			const result = await fetchAlumni(page, rowsPerPage);
			const { users, totalCount } = result.data;

			setFilteredAlumniMembers(users);
			setTotalAlumni(totalCount);
		} catch (error) {
			setErrorAlumni(error.message);
		} finally {
			setIsLoadingAlumni(false);
		}
	};

	const handleActivePageChange = useCallback(
		async (event, value) => {
			setActivePage(value);
			try {
				const result = await fetchUsers(value, rowsPerPage);
				const { users, totalCount } = result.data;
				console.log(users);
				setFilteredActiveMembers(users);
				setTotalActive(totalCount);
			} catch (error) {
				setErrorActive(error.message);
			}
		},
		[rowsPerPage],
	);

	const handleAlumniPageChange = useCallback(
		async (event, value) => {
			setAlumniPage(value);
			try {
				const result = await fetchAlumni(value, rowsPerPage);
				const { users, totalCount } = result.data;
				setFilteredAlumniMembers(users);
				setTotalAlumni(totalCount);
			} catch (error) {
				setErrorAlumni(error.message);
			}
		},
		[rowsPerPage],
	);

	const handleRowsPerPageChange = useCallback((event) => {
		setRowsPerPage(event.target.value);
	}, []);

	const handleSearchInputChange = useCallback(
		(event) => {
			const query = event.target.value;
			setSearchQuery(query);

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
			toast.info("User has been deactivated");
			setActiveMembers((prevMembers) =>
				prevMembers.filter((member) => member._id !== id),
			);
		} catch (error) {
			console.error(error);
			toast.error("Failed to deactivate user");
		}
	};

	const handleChangeRole = async (id, newRole) => {
		try {
			await changeUserAccess(id, newRole);

			const user = await fetchSingleUser(id);
			const updatedUserData = user.data;

			setActiveMembers((prevMembers) =>
				prevMembers.map((member) => (member._id === id ? updatedUserData : member)),
			);

			toast.success(`User access changed to: ${newRole}`);
		} catch (error) {
			console.error(error.message);
			toast.error("Failed to change user access");
		}
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
						<Typography variant="h6">Staff Members</Typography>
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
								onChangeRole={handleChangeRole}
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
								rowsPerPage={rowsPerPage}
								activeTab={false}
								isAlumni={true}
								count={totalAlumni}
							/>
						)}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default Members;
