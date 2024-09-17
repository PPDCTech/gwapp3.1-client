import { useState, useEffect, useCallback } from "react";
import {
	Box,
	Container,
	Stack,
	Typography,
	Tab,
	Tabs,
	Button,
} from "@mui/material";
import { useNProgress } from "../hooks/use-nprogress";
import CreateContractModal from "../components/create-contract";
import { getAllContracts } from "../services/contract-api-Services";
import { ContractsTable } from "../sections/contracts/contracts-table";
import { useAuth } from "../hooks/use-auth";
import { fetchSingleUser } from "../services/api/users.api";

const ContractList = () => {
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

	const [tabIndex, setTabIndex] = useState(0);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [contracts, setContracts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [keyword, setKeyword] = useState("");
	const [query, setQuery] = useState("");

	const fetchContracts = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getAllContracts(currentPage, limit, query, keyword);
			setContracts(res.contracts);
			setTotalPages(res.totalPages);
			setCurrentPage(res.currentPage);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Failed to fetch contracts:", error);
		}
	}, [currentPage, keyword, limit, query]);

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	useEffect(() => {
		fetchContracts();
	}, [fetchContracts]);

	useEffect(() => {
		if (tabIndex === 0) {
			setQuery("");
		} else if (tabIndex === 1) {
			setQuery("open");
		} else if (tabIndex === 2) {
			setQuery("awarded");
		}
	}, [tabIndex]);

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
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
				<Container maxWidth="lg">
					<Stack spacing={3}>
						<Box display="flex" justifyContent="space-between">
							<Box>
								<Typography variant="h5">Contract List</Typography>
							</Box>
							<Box>
								{user?.position?.some((role) =>
									[
										"tech",
										"userManager",
										"finance",
										"financeReviewer",
										"superUser",
									].includes(role),
								) && (
									<Button
										size="small"
										variant="outlined"
										color="success"
										onClick={() => setIsAddModalOpen(!isAddModalOpen)}
										sx={{ ml: 2 }}
									>
										New Contract
									</Button>
								)}
							</Box>
						</Box>
						<Box>
							<Tabs
								value={tabIndex}
								onChange={handleTabChange}
								indicatorColor="primary"
							>
								<Tab label="All Contracts" />
								<Tab label="Open Contracts" />
								<Tab label="Awarded Contracts" />
							</Tabs>
							{tabIndex === 0 && (
								<Box sx={{ mt: 2 }}>
									<ContractsTable
										title={"All Contracts"}
										loading={loading}
										contracts={contracts}
										totalPages={totalPages}
										currentPage={currentPage}
										handleNextPage={handleNextPage}
										handlePreviousPage={handlePreviousPage}
										setKeyword={setKeyword}
										fetchContracts={fetchContracts}
									/>
								</Box>
							)}
							{tabIndex === 1 && (
								<Box sx={{ mt: 2 }}>
									<ContractsTable
										title={"Open Contracts"}
										loading={loading}
										contracts={contracts}
										totalPages={totalPages}
										currentPage={currentPage}
										handleNextPage={handleNextPage}
										handlePreviousPage={handlePreviousPage}
										limit={limit}
										setKeyword={setKeyword}
										fetchContracts={fetchContracts}
									/>
								</Box>
							)}
							{tabIndex === 2 && (
								<Box sx={{ mt: 2 }}>
									<ContractsTable
										title={"Awarded Contracts"}
										loading={loading}
										contracts={contracts}
										totalPages={totalPages}
										currentPage={currentPage}
										handleNextPage={handleNextPage}
										handlePreviousPage={handlePreviousPage}
										limit={limit}
										setKeyword={setKeyword}
										fetchContracts={fetchContracts}
									/>
								</Box>
							)}
						</Box>
					</Stack>
				</Container>
			</Box>

			<CreateContractModal
				open={isAddModalOpen}
				onClose={() => setIsAddModalOpen(!isAddModalOpen)}
				isEditMode={false}
				contractData={{}}
				fetchContracts={fetchContracts}
			/>
		</>
	);
};

export default ContractList;
