import React, { useCallback, useState, useEffect } from "react";
import {
	Box,
	Container,
	Stack,
	Typography,
	Unstable_Grid2 as Grid,
} from "@mui/material";
import { AccountProfile } from "../sections/profile/account-profile";
import { AccountProfileDetails } from "../sections/profile/account-profile-details";
import { useNProgress } from "../hooks/use-nprogress";
import { useAuth } from "../hooks/use-auth";
import VendorProfile from "./vendor-profile";
import { fetchSingleUser } from "../services/api/users.api";
import { viewAVendor } from "../services/vendor-api-Services";

const Profile = () => {
	useNProgress();
	const auth = useAuth();
	const [user, setUser] = useState(auth?.user);
	const isVendor = window.localStorage.getItem("isVendor") === "true";
	const userId = window.localStorage.getItem("gwapp_userId");

	const fetchUserData = useCallback(async () => {
		try {
			if (isVendor === "true") {
				const response = await viewAVendor(userId);
				setUser(response?.data);
				auth.fetchUserData();
			} else {
				const response = await fetchSingleUser(userId);
				setUser(response?.data);
				auth.fetchUserData();
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}, [auth, isVendor, userId]);
	
	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	return (
		<>
			{!isVendor ? (
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
										<AccountProfile user={user} setUser={setUser} />
									</Grid>
									<Grid xs={12} md={6} lg={8}>
										<AccountProfileDetails user={user} setUser={setUser} />
									</Grid>
								</Grid>
							</div>
						</Stack>
					</Container>
				</Box>
			) : (
				<VendorProfile user={user} setUser={setUser} />
			)}
		</>
	);
};

export default Profile;
