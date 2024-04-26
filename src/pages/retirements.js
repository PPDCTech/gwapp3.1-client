import { Box, Container, Stack, Typography } from "@mui/material";
import { getUserUnretiredRequisitions } from "../services/api/requisition.api";
import { useEffect, useState, useCallback } from "react";
import RetirementsTable from "../sections/requisitions/retirements-table";
import { useAuth } from "../hooks/use-auth";
import { useNProgress } from "../hooks/use-nprogress";

const Retirements = () => {
      useNProgress();

  const [data, setData] = useState([]);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const response = await getUserUnretiredRequisitions(user?.email);
      const { requisitions } = response.data;
      setData(requisitions);
    } catch (error) {
      console.error("Error fetching unretired requisitions:", error.message);
    }
  }, [user])

  useEffect(() => {
			fetchData();
		}, [fetchData]);

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
            <Typography variant="h5">Retirements</Typography>
            <RetirementsTable data={data} 
            reloadData={fetchData} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Retirements;
