import { useState, useEffect, useCallback } from "react";
import {
	Box,
	Container,
	Stack,
	Typography,
	Tab,
	Tabs,
	Divider,
} from "@mui/material";
import { AddAccount } from "../sections/accounts/add-account";
import { BankAccountsTable } from "../sections/accounts/accounts-table";
import {
	getAllAccounts,
	deleteAccount,
	updateAccount,
} from "./../services/api/accounts.api";
import { fetchSingleUser } from "../services/api/users.api"; 
import { toast } from "react-toastify";
import { getAllVendors } from "../services/api/vendors.api";
import { useNProgress } from "../hooks/use-nprogress";
import { useAuth } from "../hooks/use-auth";

const Account = () => {
	useNProgress();

	const auth = useAuth();
	const [user, setUser] = useState(auth?.user);

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

	const [accounts, setAccounts] = useState([]);
	const [vendors, setVendors] = useState([]);
	const [tabValue, setTabValue] = useState(0);

	const fetchAccounts = async () => {
		try {
			const response = await getAllAccounts();
			setAccounts(response.data);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const fetchVendors = async () => {
		try {
			const response = await getAllVendors();
			setVendors(response.data);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchAccounts();
		fetchVendors();
	}, []);

	const handleUpdateAccounts = async () => {
		fetchAccounts();
	};

	const handleDeleteAccount = async (id) => {
		try {
			await deleteAccount(id);
			setAccounts(accounts.filter((account) => account._id !== id));
			toast.success("Account deleted successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleEditAccount = async (updatedAccount) => {
		try {
			await updateAccount(updatedAccount._id, updatedAccount);
			setAccounts(
				accounts.map((account) =>
					account._id === updatedAccount._id ? updatedAccount : account,
				),
			);
			toast.success("Account updated successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	return (
		<>
			<Box component="main" sx={{ flexGrow: 1, py: 8 }}>
				<Container maxWidth="lg">
					<Stack spacing={3}>
						<Box>
							<Typography variant="h6">Bank Accounts</Typography>
						</Box>
						<Box>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								indicatorColor="primary"
								textColor="primary"
								sx={{ mb: 2 }}
							>
								<Tab label="Bank Accounts" />
								<Tab label="Staff Vendor Accounts" />
							</Tabs>
							<Divider />
							<Box sx={{ mt: 2 }}>
								{tabValue === 0 && (
									<>
										<AddAccount updateAccounts={handleUpdateAccounts} user={user} />
										<BankAccountsTable
											accounts={accounts}
											onDelete={handleDeleteAccount}
                      onEdit={handleEditAccount}
                      user={user}
										/>
									</>
								)}
								{tabValue === 1 && (
									<BankAccountsTable
										accounts={vendors}
										onDelete={handleDeleteAccount}
										onEdit={handleEditAccount}
                    isVendor={true}
                    user={user}
									/>
								)}
							</Box>
						</Box>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default Account;
