import { Box, Container, Stack, Typography } from "@mui/material";
import BinRequisitions from "../sections/requisitions/bin-table";
import { useNProgress } from "../hooks/use-nprogress";

const Bin = () => {
      useNProgress();

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
              <Typography color="error" variant="h6">
                Requisitions set for deletion
              </Typography>
            </Box>
            <Box>
              <BinRequisitions />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};


export default Bin;
