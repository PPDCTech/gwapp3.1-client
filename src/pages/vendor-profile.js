import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	Stack,
	Typography,
	Unstable_Grid2 as Grid,
	IconButton,
	Tooltip
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useNProgress } from "../hooks/use-nprogress";
import { useParams, Link } from "react-router-dom";
import { viewAVendor } from "../services/vendor-api-Services";
import { VendorAccountProfile } from "../sections/vendor-profile/account-profile";
import { VendorProfileDetails } from "../sections/vendor-profile/account-profile-details";

const VendorProfile = ({ user }) => {
	useNProgress();
	const { vendorId } = useParams();

	const [userId, setUserId] = useState("");

	const [vendor, setVendor] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(false);

	useEffect(() => {
		if (user) {
			setIsViewingOwnProfile(true);
			setUserId(user._id);
		}
		
		if (vendorId) {
			setUserId(vendorId);
			setIsViewingOwnProfile(false);
		}
		
	}, [user , vendorId]);

	useEffect(() => {
		setLoading(true);
		const fetchVendorData = async () => {
			try {
				const res = await viewAVendor(userId);
				setVendor(res.data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error("Failed to fetch vendor data:", error);
			}
		};

		fetchVendorData();
	}, [userId]);

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

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
					<Stack spacing={1}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography variant="h4">Profile</Typography>
							{isViewingOwnProfile && (
								<Tooltip title="Edit Profile">
									<IconButton
										component={Link}
										to={`/vendor/${userId}/update-profile`}
										color="success"
									>
										<EditIcon />
									</IconButton>
								</Tooltip>
							)}
						</div>
						<div>
							<Grid container spacing={2}>
								<Grid xs={12} md={6} lg={4}>
									<VendorAccountProfile
										vendor={vendor}
										isViewingOwnProfile={isViewingOwnProfile}
									/>
								</Grid>
								<Grid xs={12} md={6} lg={8}>
									<VendorProfileDetails
										vendor={vendor}
										isViewingOwnProfile={isViewingOwnProfile}
									/>
								</Grid>
							</Grid>
						</div>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default VendorProfile;
