/* eslint-disable no-case-declarations */
import { useState, useEffect, useCallback } from "react";
import {
	Box,
	Button,
	Container,
	Grid,
	Typography,
	Divider,
	Alert,
	AlertTitle,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import CreateReqModal from "../components/create-req";
// import ChatModal from "../components/chat-modal";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import RequisitionDetailsModal from "../components/req-details-modal";
import { RequisitionTable } from "../sections/requisitions/requisitions-table";
import { useAuth } from "../hooks/use-auth";
import {
	getAllRequisitions,
	getAttentionedToRequisitions,
	getUserRequisitions,
	getAttentionedToRequisitionsNoPending,
} from "../services/api/requisition.api";
import { fetchSingleUser } from "../services/api/users.api";
import { FilterRequisitions } from "../sections/requisitions/filter-requisitions";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Warning } from "@mui/icons-material";
import { CustomTab } from "../components/CustomTab";
import { useNProgress } from "../hooks/use-nprogress";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Requisitions = () => {
	useNProgress();
	const { user } = useAuth();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const reqId = queryParams.get("id");
	const action = queryParams.get("action");
	const tab = queryParams.get("selectedTab");

	const [userData, setUserData] = useState("");

	const fetchUserData = useCallback(async () => {
		try {
			const userId = window.localStorage.getItem("gwapp_userId");
			if (userId) {
				const response = await fetchSingleUser(userId);
				setUserData(response?.data);
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}, []);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const [requisitions, setRequisitions] = useState([]);
	const [filteredRequisitions, setFilteredRequisitions] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [selectedTab, setSelectedTab] = useState("myRequisitions");
	const [isCreateReqModalOpen, setCreateReqModalOpen] = useState(false);
	const [selectedRequisition] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(10);
	const [filteredPage, setFilteredPage] = useState(0);
	const [filteredLimit, setFilteredLimit] = useState(10);
	const [filteredTotalCount, setFilteredTotalCount] = useState(0);

	useEffect(() => {
		if (tab) {
			setSelectedTab(tab);
		}
	}, [tab]);

	const handleTabChange = (newValue) => {
		setSelectedTab(newValue);
		setPage(0);
	};

	useEffect(() => {
		if (
			user?.position?.some((role) =>
				["user", "staff", "financeUser", "tech"].includes(role),
			)
		) {
			setSelectedTab("myRequisitions");
		}
		if (
			user?.position?.some((role) =>
				["superUser", "finance", "financeReviewer", "budgetHolder"].includes(role),
			)
		) {
			setSelectedTab("forMyAttention");
		}
	}, [user]);

	const fetchRequisitions = useCallback(async () => {
		setLoading(true);
		try {
			setFilteredRequisitions([]);
			let fetchedRequisitions;
			let count;

			switch (selectedTab) {
				case "myRequisitions":
					fetchedRequisitions = [];
					const myReqs = await getUserRequisitions(user?._id, page, limit);
					fetchedRequisitions = myReqs.data.requisitions;
					count = myReqs.data.totalCount;
					break;
				case "forMyAttention":
					fetchedRequisitions = [];
					const myAttentionReqs = await getAttentionedToRequisitions(
						user?.email,
						page,
						limit,
					);

					fetchedRequisitions = myAttentionReqs.data.requisitions;
					count = myAttentionReqs.data.totalCount;
					break;
				case "allForMyAttention":
					fetchedRequisitions = [];
					const myAllAttentionReqs = await getAttentionedToRequisitionsNoPending(
						user?.email,
						page,
						limit,
					);

					fetchedRequisitions = myAllAttentionReqs.data.requisitions;
					count = myAllAttentionReqs.data.totalCount;
					break;
				case "allRequisitions":
					fetchedRequisitions = [];
					const allReqs = await getAllRequisitions(page, limit);
					fetchedRequisitions = allReqs.data.requisitions;
					count = allReqs.data.totalCount;
					break;
				default:
					fetchedRequisitions = [];
					count = 0;
			}
			setRequisitions(fetchedRequisitions);
			setTotalCount(count);
		} catch (error) {
			console.error("Error fetching requisitions:", error);
		} finally {
			setLoading(false);
		}
	}, [selectedTab, user, page, limit]);

	useEffect(() => {
		if (user) {
			fetchRequisitions();
		}
		if (selectedTab) {
			fetchRequisitions();
		}
	}, [fetchRequisitions, selectedTab, user]);

	const handleOpenCreateModal = () => {
		setEditMode(false);
		setCreateReqModalOpen(true);
	};

	const handleCloseCreateModal = () => {
		setEditMode(false);
		setCreateReqModalOpen(false);
		fetchRequisitions();
	};

	const handleEditRequisition = (editedRequisition) => {
		const updatedRequisitions = requisitions.map((req) =>
			req._id === editedRequisition._id ? editedRequisition : req,
		);
		setRequisitions(updatedRequisitions);
	};

	const handlePageChange = useCallback(
		async (event, pageVal) => {
			setPage(pageVal);
			try {
				setFilteredRequisitions([]);
				let fetchedRequisitions;
				let count;

				switch (selectedTab) {
					case "myRequisitions":
						fetchedRequisitions = [];
						const myReqs = await getUserRequisitions(user?._id, pageVal, limit);
						fetchedRequisitions = myReqs.data.requisitions;
						count = myReqs.data.totalCount;
						break;
					case "forMyAttention":
						fetchedRequisitions = [];
						const myAttentionReqs = await getAttentionedToRequisitions(
							user?.email,
							pageVal,
							limit,
						);

						fetchedRequisitions = myAttentionReqs.data.requisitions;
						count = myAttentionReqs.data.totalCount;
						break;
					case "allForMyAttention":
						fetchedRequisitions = [];
						const myAllAttentionReqs = await getAttentionedToRequisitionsNoPending(
							user?.email,
							pageVal,
							limit,
						);

						fetchedRequisitions = myAllAttentionReqs.data.requisitions;
						count = myAllAttentionReqs.data.totalCount;
						break;
					case "allRequisitions":
						fetchedRequisitions = [];
						const allReqs = await getAllRequisitions(pageVal, limit);
						fetchedRequisitions = allReqs.data.requisitions;
						count = allReqs.data.totalCount;
						break;
					default:
						fetchedRequisitions = [];
						count = 0;
				}
				setRequisitions(fetchedRequisitions);
				setTotalCount(count);
			} catch (error) {
				console.error("Error fetching requisitions:", error);
			}
		},
		[selectedTab, user, limit],
	);

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value, 10));
	};

	const handleFilteredPageChange = useCallback(
		async (event, pageVal) => {
			setFilteredPage(pageVal);
			try {
				setFilteredRequisitions([]);
				let fetchedRequisitions;
				let count;

				switch (selectedTab) {
					case "myRequisitions":
						fetchedRequisitions = [];
						const myReqs = await getUserRequisitions(user?._id, pageVal, limit);
						fetchedRequisitions = myReqs.data.requisitions;
						count = myReqs.data.totalCount;
						break;
					case "forMyAttention":
						fetchedRequisitions = [];
						const myAttentionReqs = await getAttentionedToRequisitions(
							user?.email,
							pageVal,
							limit,
						);

						fetchedRequisitions = myAttentionReqs.data.requisitions;
						count = myAttentionReqs.data.totalCount;
						break;
					case "allForMyAttention":
						fetchedRequisitions = [];
						const myAllAttentionReqs = await getAttentionedToRequisitionsNoPending(
							user?.email,
							pageVal,
							limit,
						);

						fetchedRequisitions = myAllAttentionReqs.data.requisitions;
						count = myAllAttentionReqs.data.totalCount;
						break;
					case "allRequisitions":
						fetchedRequisitions = [];
						const allReqs = await getAllRequisitions(pageVal, limit);
						fetchedRequisitions = allReqs.data.requisitions;
						count = allReqs.data.totalCount;
						break;
					default:
						fetchedRequisitions = [];
						count = 0;
				}
				setRequisitions(fetchedRequisitions);
				setTotalCount(count);
			} catch (error) {
				console.error("Error fetching requisitions:", error);
			}
		},
		[selectedTab, user, limit],
	);

	const handleFilteredLimitChange = (event) => {
		setFilteredLimit(parseInt(event.target.value, 10));
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
				<Container maxWidth="xl">
					<Grid container spacing={3}>
						<Grid
							item
							xs={12}
							sx={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<Typography variant="h6" component="div" gutterBottom>
								Requisitions
							</Typography>
							<Box>
								{userData?.position?.some((userRole) =>
									["user", "staff", "userManager", "financeUser", "tech"].includes(
										userRole,
									),
								) && (
									<>
										{userData?.signatureUrl ? (
											<Button
												size="small"
												variant="outlined"
												color="success"
												onClick={handleOpenCreateModal}
												sx={{ ml: 2 }}
											>
												<CreateNewFolderIcon />
												&nbsp; New Request
											</Button>
										) : (
											<Button href="/profile" startIcon={<Warning />} color="warning">
												Upload your Signature to raise request
											</Button>
										)}
									</>
								)}
							</Box>
							<CreateReqModal
								open={isCreateReqModalOpen}
								onClose={handleCloseCreateModal}
								isEditMode={editMode}
								requisitionData={selectedRequisition ? selectedRequisition : null}
							/>
						</Grid>

						<Grid item xs={12}>
							<Divider />
						</Grid>

						<Grid item xs={12}>
							<FilterRequisitions
								setLoading={setLoading}
								filteredLimit={filteredLimit}
								filteredPage={filteredPage}
								setFilteredTotalCount={setFilteredTotalCount}
								setFilteredRequisitions={setFilteredRequisitions}
							/>
						</Grid>

						<Grid item xs={12}>
							<div style={{ display: "flex" }}>
								{userData?.position?.some((role) =>
									["user", "staff", "financeUser", "tech"].includes(role),
								) && (
									<CustomTab
										isActive={selectedTab === "myRequisitions"}
										value="myRequisitions"
										onClick={() => handleTabChange("myRequisitions")}
										label="My Requisitions"
									/>
								)}
								{userData?.position?.some((role) =>
									[
										"tech",
										"budgetHolder",
										"finance",
										"financeReviewer",
										"superUser",
									].includes(role),
								) && (
									<CustomTab
										isActive={selectedTab === "forMyAttention"}
										value="forMyAttention"
										onClick={() => handleTabChange("forMyAttention")}
										label="Requisitions for my attention"
									/>
								)}
								{userData?.position?.some((role) =>
									["budgetHolder"].includes(role),
								) && (
									<CustomTab
										isActive={selectedTab === "allForMyAttention"}
										value="allForMyAttention"
										onClick={() => handleTabChange("allForMyAttention")}
										label="Requisitions attented"
									/>
								)}
								{userData?.position?.some((role) =>
									[
										"tech",
										"financeUser",
										"finance",
										"financeReviewer",
										"superUser",
									].includes(role),
								) && (
									<CustomTab
										isActive={selectedTab === "allRequisitions"}
										value="allRequisitions"
										onClick={() => handleTabChange("allRequisitions")}
										label="All Requisitions"
									/>
								)}
							</div>

							{selectedTab === "forMyAttention" && (
								<>
									{user?.position?.some((role) => ["budgetHolder"].includes(role)) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have status of pending (Pending), and attend to them
											</div>
											<small>
												You are seeing this because you have Budget Holder access
											</small>
										</Alert>
									)}
									{user?.position?.some((role) => ["finance"].includes(role)) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have been checked by the Budget Holder (Holder Checked), now ready
												for your checking
											</div>
											<small>You are seeing this because you have Finance access</small>
										</Alert>
									)}
									{user?.position?.some((role) =>
										["financeReviewer"].includes(role),
									) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have been checked by the Finance (Finance Checked), now ready for
												your final review
											</div>
											<small>
												You are seeing this because you have Finance Reviewer access
											</small>
										</Alert>
									)}
									{user?.position?.some((role) => ["superUser"].includes(role)) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have been reviewed by the Finance (Finance Reviewed), now ready for
												your approval
											</div>
											<small>You are seeing this because you are an Approver</small>
										</Alert>
									)}
								</>
							)}

							{selectedTab === "allForMyAttention" && (
								<>
									{user?.position?.some((role) => ["budgetHolder"].includes(role)) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have status of pending (Pending), and attend to them
											</div>
											<small>
												You are seeing this because you have Budget Holder access
											</small>
										</Alert>
									)}
								</>
							)}
							{selectedTab === "allRequisitions" && (
								<>
									{user?.position?.some((role) => ["finance"].includes(role)) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have been checked by the Budget Holder (Holder Checked), now ready
												for your checking
											</div>
											<small>You are seeing this because you have Finance access</small>
										</Alert>
									)}
									{user?.position?.some((role) =>
										["financeReviewer"].includes(role),
									) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have been checked by the Finance (Finance Checked), now ready for
												your final review
											</div>
											<small>
												You are seeing this because you have Finance Reviewer access
											</small>
										</Alert>
									)}
									{user?.position?.some((role) => ["superUser"].includes(role)) && (
										<Alert severity="info" onClose={() => {}}>
											<AlertTitle>Hint</AlertTitle>
											<div>
												Use the 'filter requisitions' section above to filter requests that
												have been reviewed by the Finance (Finance Reviewed), now ready for
												your approval
											</div>
											<small>You are seeing this because you are an Approver</small>
										</Alert>
									)}
								</>
							)}

							<RequisitionTable
								requisitions={
									filteredRequisitions.length > 0 ? filteredRequisitions : requisitions
								}
								loading={loading}
								totalCount={
									filteredRequisitions.length > 0 ? filteredTotalCount : totalCount
								}
								currentTab={selectedTab}
								setRequisitions={setRequisitions}
								onEditRequisition={handleEditRequisition}
								updateTableData={fetchRequisitions}
								reqId={reqId}
								action={action}
								tab={tab}
								page={filteredRequisitions.length > 0 ? filteredPage : page}
								limit={filteredRequisitions.length > 0 ? filteredLimit : limit}
								onPageChange={
									filteredRequisitions.length > 0
										? handleFilteredPageChange
										: handlePageChange
								}
								onLimitChange={
									filteredRequisitions.length > 0
										? handleFilteredLimitChange
										: handleLimitChange
								}
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

export default Requisitions;
