import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  TablePagination,
  SvgIcon,
  Tooltip,
  Grid,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save } from "@mui/icons-material";
import axios from "axios";
import { ACCOUNT_CODES_API } from "../../services/constants";
import { AddAccountCodeModal } from "../../components/add-accountcode-modal";
import { toast } from "react-toastify";

export const AccountCodesTable = () => {
  const [accountCodes, setAccountCodes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [newCodeValue, setNewCodeValue] = useState("");
  const [newCodeDesc, setNewCodeDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchAccountCodes = async () => {
      const response = await axios.get(ACCOUNT_CODES_API);
      setAccountCodes(response.data);
    };
    fetchAccountCodes();
  }, [accountCodes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (id) => {
    setEditId(id);
  };

  const handleSaveClick = async (id) => {
    const editedCode = accountCodes.find((code) => code._id === id);
    try {
      if (newCodeValue) {
        editedCode.value = Number(newCodeValue);
      }
      if (newCodeDesc) {
        editedCode.description = newCodeDesc;
      }
      await axios.put(`${ACCOUNT_CODES_API}/${id}`, editedCode);
    } catch (error) {
      console.error("Error updating account code:", error);
    } finally {
      setEditId(null);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddAccountCode = async (newCode) => {
    try {
      const response = await axios.post(ACCOUNT_CODES_API, newCode);

      if (response.status === 200) {
        const updatedResponse = await axios.get(ACCOUNT_CODES_API);
        setAccountCodes(updatedResponse.data);
        toast.success("New code added");
      }
    } catch (error) {
      console.error("Error adding account code:", error);
    }
  };

  const handleDeleteCode = async (id) => {
    try {
      await axios.delete(`${ACCOUNT_CODES_API}/${id}`);

      const updatedAccountCodes = accountCodes.filter((code) => code._id !== id);
      setAccountCodes(updatedAccountCodes);

      toast.success("Code deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Grid container
spacing={2}>
        <Grid item
xs={12}
md={6}>
          <TextField
            label="Search Account Codes"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
          />
        </Grid>
        <Grid item
xs={12}
md={6}
sx={{ display: "flex", alignItems: "center" }}>
          <AddAccountCodeModal onAddNew={handleAddAccountCode} />
        </Grid>
      </Grid>
      {accountCodes && accountCodes.length > 0 ? (
        <>
          {accountCodes.filter((code) =>
            code.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <Typography sx={{ mt: 2 }}>No account codes found for this query.</Typography>
          )}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "30%" }}>Code</TableCell>
                  <TableCell sx={{ width: "40%" }}>Description</TableCell>
                  <TableCell sx={{ width: "30%" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountCodes
                  .filter((code) =>
                    code.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((code) => (
                    <TableRow
                      key={code._id}
                      sx={editId === code._id ? { border: "1px solid #0B815A" } : { '&:hover': {backgroundColor: "#F5F7FF"} }}
                    >
                      <TableCell>
                        {editId === code._id ? (
                          <TextField
                            defaultValue={code.value}
                            onChange={(e) => setNewCodeValue(e.target.value)}
                          />
                        ) : (
                          code.value
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === code._id ? (
                          <TextField
                            defaultValue={code.description}
                            onChange={(e) => setNewCodeDesc(e.target.value)}
                          />
                        ) : (
                          code.description
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === code._id ? (
                          <IconButton onClick={() => handleSaveClick(code._id)}
aria-label="save">
                            <SvgIcon fontSize="small"
color="success">
                              <Save />
                            </SvgIcon>
                          </IconButton>
                        ) : (
                          <>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDeleteCode(code._id)}
                                aria-label="delete"
                              >
                                <SvgIcon fontSize="small"
color="error">
                                  <DeleteIcon />
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleEditClick(code._id)}
                                aria-label="edit"
                              >
                                <SvgIcon fontSize="small"
color="info">
                                  <EditIcon />
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={accountCodes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography sx={{ mt: 2 }}>No Accounts found.</Typography>
      )}
    </>
  );
};
