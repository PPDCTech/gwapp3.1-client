import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  Select,
  SvgIcon,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import { toast } from "react-toastify";
import axios from "axios";
import { DEACTIVATE_USER_API, USER_ACCESS_LABELS } from "src/services/constants";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

export const MembersTable = (props) => {
  const {
    count = 0,
    members = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    isAlumni = false,
    onDeactivate,
    onChangeRole,
  } = props;

  const [deactivateLoading, setDeactivateLoading] = useState({});
  const [selectedRole, setSelectedRole] = useState("");

  const handleDeactivate = async (id) => {
    try {
      setDeactivateLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
      onDeactivate(id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeactivateLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
    }
  };

  const handleChangeRole = (id, newRole) => {
    onChangeRole(id, newRole);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                {!isAlumni && (
                  <>
                    <TableCell>Phone</TableCell>
                    <TableCell>Access Level</TableCell>
                    <TableCell>Action</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow hover
key={member._id}>
                  <TableCell>
                    <Stack alignItems="center"
direction="row"
spacing={2}>
                      <Avatar src={member.photoUrl || ""}>{getInitials(member.name)}</Avatar>
                      <Typography variant="subtitle2">{member.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  {!isAlumni && (
                    <>
                      <TableCell>{member.phone || "N/A"}</TableCell>
                      <TableCell>{USER_ACCESS_LABELS[member.accessLevel]}</TableCell>
                      <TableCell>
                        <Stack direction="row"
spacing={1}>
                          <Tooltip title="Deactivate">
                            <IconButton
                              onClick={() => handleDeactivate(member._id)}
                              aria-label="Preview"
                              color="error"
                              sx={{ fontSize: "1rem" }}
                              disabled={deactivateLoading[member._id]}
                            >
                              {deactivateLoading[member._id] ? (
                                <CircularProgress size={14} />
                              ) : (
                                <SvgIcon fontSize="small">
                                  <BlockIcon />
                                </SvgIcon>
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Change Access">
                            <Select
                              size="small"
                              value={selectedRole}
                              onChange={(event) => handleChangeRole(member._id, event.target.value)}
                            >
                              <MenuItem value="superUser">Super User</MenuItem>
                              <MenuItem value="userManager">User Manager</MenuItem>
                              <MenuItem value="budgetHolder">Budget Holder</MenuItem>
                              <MenuItem value="finance">Finance</MenuItem>
                              <MenuItem value="financeReviewer">Finance Reviewer</MenuItem>
                              <MenuItem value="tech">Tech</MenuItem>
                            </Select>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </Card>
  );
};

MembersTable.propTypes = {
  count: PropTypes.number,
  members: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  isAlumni: PropTypes.bool,
};
