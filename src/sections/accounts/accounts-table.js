import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  SvgIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const BankAccountsTable = ({ accounts, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (id) => {
    setEditId(id);
  };

  const handleSaveClick = (id) => {
    const editedAccount = accounts.find((account) => account._id === id);
    if (newAccountName) {
        editedAccount["accountName"] = newAccountName;
    }
    if (newAccountNumber) {
        editedAccount["accountNumber"] = newAccountNumber;
    }
    onEdit(editedAccount);
    setEditId(null);
  };

  return (
    <>
      {accounts && accounts.length > 0 ? (
        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bank Name</TableCell>
                <TableCell>Holder</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow
                  key={account._id}
                  sx={editId === account._id ? { border: "1px solid #0B815A" } : {}}
                >
                  <TableCell>{account.bankName}</TableCell>
                  <TableCell>
                    {editId === account._id ? (
                      <TextField
                        defaultValue={account.accountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                      />
                    ) : (
                      account.accountName
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === account._id ? (
                      <TextField
                        defaultValue={account.accountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                      />
                    ) : (
                      account.accountNumber
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === account._id ? (
                      <IconButton onClick={() => handleSaveClick(account._id)}
aria-label="save">
                        <SvgIcon color="success"
fontSize="small">
                          <Save />
                        </SvgIcon>
                      </IconButton>
                    ) : (
                      <>
                        <IconButton onClick={() => onDelete(account._id)}
aria-label="delete">
                          <SvgIcon color="error"
fontSize="small">
                            <DeleteIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton onClick={() => handleEditClick(account._id)}
aria-label="edit">
                          <SvgIcon color="info"
fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ mt: 2 }}>No Accounts found.</Typography>
      )}
    </>
  );
};
