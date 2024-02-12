import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AddAccount } from "src/sections/accounts/add-account";
import { BankAccountsTable } from "src/sections/accounts/accounts-table";
import { useEffect, useState } from "react";
// import axios from "axios";
// import { ACCOUNTS_API } from "src/services/constants";
import { toast } from "react-toastify";
import { deleteAccount, getAllAccounts, updateAccount } from "src/services/api/accounts.api";

const Page = () => {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await getAllAccounts();
      setAccounts(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  });

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
      setAccounts(accounts.map((account) => (account._id === updatedAccount._id ? updatedAccount : account)));
      toast.success("Account updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Accounts | Gwapp</title>
      </Head>
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
              <Typography variant="h6">Bank Accounts</Typography>
            </Box>
            <Box>
              <AddAccount updateAccounts={handleUpdateAccounts} />
              <BankAccountsTable
                accounts={accounts}
                onDelete={handleDeleteAccount}
                onEdit={handleEditAccount}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
