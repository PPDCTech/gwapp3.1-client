import { useState, useEffect, useCallback } from "react";
import { Box, Container, Stack, Typography, Tab, Tabs } from "@mui/material";
import { useNProgress } from "../hooks/use-nprogress";
import { VendorsTable } from "../sections/vendors/vendors-table";
import { getAllVendors } from "../services/vendor-api-Services";
import { fetchSingleUser } from "../services/api/users.api";
import { useAuth } from "../hooks/use-auth";

const VendorList = () => {
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
	const [vendors, setVendors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [keyword, setKeyword] = useState("");
	const [query, setQuery] = useState("");

	const fetchVendors = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getAllVendors(currentPage, limit, query, keyword);
			setVendors(res.vendors);
			setTotalPages(res.totalPages);
			setCurrentPage(res.currentPage);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Failed to fetch vendors:", error);
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

	const handleSearchChange = (e) => {
		setKeyword(e.target.value);
		fetchVendors();
	};

	useEffect(() => {
		fetchVendors();
	}, [fetchVendors]);

	useEffect(() => {
		if (tabIndex === 0) {
			setQuery("");
			fetchVendors();
		} else if (tabIndex === 1) {
			setQuery("verified");
			fetchVendors();
		} else if (tabIndex === 2) {
			setQuery("pending");
			fetchVendors();
		}
	}, [tabIndex, fetchVendors]);

useEffect(() => {
	const allowedRoles = [
		"tech",
		"userManager",
		"finance",
		"financeReviewer",
		"superUser",
	];

	const hasAllowedRole = user?.position?.some((role) =>
		allowedRoles.includes(role),
	);

	if (!hasAllowedRole) {
		setQuery("verified");
		setTabIndex(1);
	}
}, [user]);


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
						<Box>
							<Typography variant="h5">Vendor List</Typography>
						</Box>
						<Box>
							<Tabs
								value={tabIndex}
								onChange={handleTabChange}
								indicatorColor="primary"
							>
								{user?.position?.some((role) =>
									[
										"tech",
										"userManager",
										"finance",
										"financeReviewer",
										"superUser",
									].includes(role),
								) && <Tab label="All Vendors" />}
								<Tab label="Verified Vendors" />
								{user?.position?.some((role) =>
									[
										"tech",
										"userManager",
										"finance",
										"financeReviewer",
										"superUser",
									].includes(role),
								) && <Tab label="Pending Verification" />}
							</Tabs>
							{tabIndex === 0 && (
								<Box sx={{ mt: 2 }}>
									<VendorsTable
										query={query}
										title={"All Vendors"}
										vendors={vendors}
										setKeyword={setKeyword}
										loading={loading}
										fetchVendors={fetchVendors}
										currentPage={currentPage}
										totalPages={totalPages}
										handleNextPage={handleNextPage}
										handlePreviousPage={handlePreviousPage}
										handleSearchChange={handleSearchChange}
									/>
								</Box>
							)}
							{tabIndex === 1 && (
								<Box sx={{ mt: 2 }}>
									<VendorsTable
										query={query}
										title={"Verified Vendors"}
										vendors={vendors}
										setKeyword={setKeyword}
										loading={loading}
										fetchVendors={fetchVendors}
										currentPage={currentPage}
										totalPages={totalPages}
										handleNextPage={handleNextPage}
										handlePreviousPage={handlePreviousPage}
										handleSearchChange={handleSearchChange}
									/>
								</Box>
							)}
							{tabIndex === 2 && (
								<Box sx={{ mt: 2 }}>
									<VendorsTable
										query={query}
										title={"Pending Verification"}
										vendors={vendors}
										setKeyword={setKeyword}
										loading={loading}
										fetchVendors={fetchVendors}
										currentPage={currentPage}
										totalPages={totalPages}
										handleNextPage={handleNextPage}
										handlePreviousPage={handlePreviousPage}
										handleSearchChange={handleSearchChange}
									/>
								</Box>
							)}
						</Box>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default VendorList;
