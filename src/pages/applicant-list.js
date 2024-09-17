import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Stack, Typography, Tab, Tabs } from "@mui/material";
import { useNProgress } from "../hooks/use-nprogress";
import { ApplicantsTable } from "../sections/applicants/applicants-table";

const ApplicantList = () => {
	useNProgress();
	const location = useLocation();
	const contract = location.state; 

	const [tabIndex, setTabIndex] = useState(0);
	const [vendors, setVendors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		if (contract) {
			setLoading(true);
			setVendors(contract.applicants || []);
			setTotalPages(Math.ceil((contract.applicants || []).length / 10)); // Assuming 10 items per page
			setLoading(false);
		}
	}, [contract]);

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

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

	return (
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
						<Typography variant="h5">Applicant List</Typography>
					</Box>
					<Box>
						<Tabs
							value={tabIndex}
							onChange={handleTabChange}
							indicatorColor="primary"
						>
							<Tab label="All Applicants" />
						</Tabs>
						{tabIndex === 0 && (
							<Box sx={{ mt: 2 }}>
								<ApplicantsTable
									title={`Applicants for: ${contract?.title || "N/A"}`}
									vendors={vendors}
									loading={loading}
									currentPage={currentPage}
									totalPages={totalPages}
									handleNextPage={handleNextPage}
									handlePreviousPage={handlePreviousPage}
								/>
							</Box>
						)}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
};

export default ApplicantList;
