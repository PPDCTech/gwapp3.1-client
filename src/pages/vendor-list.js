import { Box, Container, Stack, Typography, Tab, Tabs } from "@mui/material";

import { useState, useEffect, useCallback } from "react";
import { useNProgress } from "../hooks/use-nprogress";
import { VendorsTable } from "../sections/vendors/vendors-table";
import { getAllVendors } from "../services/vendor-api-Services";

const VendorList = () => {
	useNProgress();

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
		}
	}, [tabIndex, fetchVendors]);

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
								<Tab label="All Vendors" />
								<Tab label="Verified Vendors" />
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
						</Box>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default VendorList;
