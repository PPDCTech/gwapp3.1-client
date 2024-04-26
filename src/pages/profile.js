import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { AccountProfile } from "../sections/profile/account-profile";
import { AccountProfileDetails } from "../sections/profile/account-profile-details";
import { useNProgress } from "../hooks/use-nprogress";

const Profile = () => {
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
            <div>
              <Typography variant="h4">Account</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <AccountProfile />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <AccountProfileDetails />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default Profile;
