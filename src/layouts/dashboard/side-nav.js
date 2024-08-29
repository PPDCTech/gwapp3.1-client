import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
	Box,
	Drawer,
	Stack,
	Divider,
	useMediaQuery,
	Typography,
} from "@mui/material";
import { Logo } from "../../components/logo";
import { Scrollbar } from "../../components/scrollbar";
import { fetchSingleUser } from "../../services/api/users.api";
import { items } from "./config";
import { useAuth } from "../../hooks/use-auth";
import { SideNavItem } from "./side-nav-item";

export const SideNav = (props) => {
	const { open, onClose } = props;
	const location = useLocation(); // Use useLocation to get the current pathname
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
	const auth = useAuth();
	const [user, setUser] = useState(auth?.user);
	const [sidebarItems, setSidebarItems] = useState([]);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		const filteredItems = items.filter((item) => {
			if (
				user?.position?.some((role) =>
					["tech", "finance", "financeReviewer"].includes(role),
				)
			) {
				return true;
			}
			if (user?.position?.some((role) => ["financeUser"].includes(role))) {
				return item.path !== "/bin";
			}
			if (user?.position?.some((role) => ["superUser"].includes(role))) {
				return item.path !== "/retirements";
			}
			if (user?.position?.some((role) => ["budgetHolder"].includes(role))) {
				return item.path !== "/retirements" && item.path !== "/accounts";
			}

			if (user?.position?.some((role) => ["user", "userManager"].includes(role))) {
				return (
					item.path !== "/accounts" &&
					item.path !== "/projects" &&
					item.path !== "/bin"
				);
			}
			return false;
		});
		setSidebarItems(filteredItems);
		setLoading(false);
	}, [user]);

	const content = (
		<Scrollbar>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					background: "neutral.100",
				}}
			>
				<Box sx={{ p: 3 }}>
					<div
						style={{
							display: "inline-flex",
							height: 32,
							width: 32,
						}}
					>
						<Link to={"/"}>
							<Logo />
						</Link>
					</div>

					<Box
						sx={{
							alignItems: "center",
							border: "1px solid rgba(255, 255, 255, 0.08)",
							borderRadius: 1,
							cursor: "pointer",
							display: "flex",
							justifyContent: "space-between",
							mt: 2,
							p: "12px",
						}}
					>
						<div>
							<Typography color="inherit" variant="Logo">
								GWAPP
							</Typography>
						</div>
					</Box>
				</Box>
				<Divider sx={{ borderColor: "neutral.700" }} />
				<Box
					component="nav"
					sx={{
						flexGrow: 1,
						px: 2,
						py: 3,
					}}
				>
					<Stack
						component="ul"
						spacing={0.5}
						sx={{
							listStyle: "none",
							p: 0,
							m: 0,
						}}
					>
						{!loading &&
							sidebarItems?.map((item) => (
								<SideNavItem
									active={location.pathname === item.path}
									disabled={item.disabled}
									external={item.external}
									icon={item.icon}
									key={item.title}
									path={item.path}
									title={item.title}
								/>
							))}
					</Stack>
				</Box>
				<Divider sx={{ borderColor: "neutral.700" }} />
			</div>
		</Scrollbar>
	);

	if (lgUp) {
		return (
			<Drawer
				anchor="left"
				open
				PaperProps={{
					sx: {
						backgroundColor: "neutral.800",
						color: "common.white",
						width: 280,
					},
				}}
				variant="permanent"
			>
				{content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor="left"
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: "neutral.800",
					color: "common.white",
					width: 280,
				},
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant="temporary"
		>
			{content}
		</Drawer>
	);
};

SideNav.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
