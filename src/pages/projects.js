import { Box, Container, Stack, Typography, Tab, Tabs } from "@mui/material";

import { useState } from "react";
import { AccountCodesTable } from "../sections/projects/account-codes-table";
import { BudgetCodesTable } from "../sections/projects/budget-codes-table";
import { ProjectCodesTable } from "../sections/projects/project-codes-table";
import { useNProgress } from "../hooks/use-nprogress";

const Projects = () => {
	useNProgress();

	const [tabIndex, setTabIndex] = useState(0);

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
							<Typography variant="h5">Projects & Codes</Typography>
						</Box>
						<Box>
							<Tabs
								value={tabIndex}
								onChange={handleTabChange}
								indicatorColor="primary"
							>
								<Tab label="Projects" />
								<Tab label="Account Codes" />
								<Tab label="Budget Codes" />
							</Tabs>
							{tabIndex === 0 && (
								<Box sx={{ mt: 2 }}>
									<ProjectCodesTable />
								</Box>
							)}
							{tabIndex === 1 && (
								<Box sx={{ mt: 2 }}>
									<AccountCodesTable />
								</Box>
							)}
							{tabIndex === 2 && (
								<Box sx={{ mt: 2 }}>
									<BudgetCodesTable />
								</Box>
							)}
						</Box>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default Projects;
