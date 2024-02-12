import React, { useState, useEffect } from "react";
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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Box,
  Grid,
  Button,
  Modal,
  Autocomplete,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { bankCodes } from "src/services/bankCodes";
import { toast } from "react-toastify";
import axios from "axios";
import { PROJECT_CODES_API } from "src/services/constants";
import { indigo } from "src/theme/colors";

export const ProjectCodesTable = () => {
  const [expanded, setExpanded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [funder, setFunder] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [balance, setBalance] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchInitialProjects = async () => {
    const response = await axios.get(PROJECT_CODES_API);
    setProjects(response.data);
  };

  useEffect(() => {
    fetchInitialProjects();
  }, [projects]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      const projectData = {
        funder: funder,
        projectName: projectName,
        account: {
          bankName: bankName,
          accountName: accountName,
          accountNumber: accountNumber,
        },
      };

      await axios.post(PROJECT_CODES_API, projectData);
      fetchInitialProjects();
      toast.success(`${projectName} project created!`);
      handleClose();
    } catch (error) {
      toast.error("Failed to create project:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleBankNameChange = (event, value) => {
    setBankName(value);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
  };

  return (
    <>
      {projects && projects.length > 0 ? (
        <Card sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ my: 3 }} variant="h6">
              Projects
            </Typography>

            <Box>
              <Button
                variant="outlined"
                sx={{ color: indigo.main }}
                onClick={handleOpen}
                className="btn btn-type-info btn-md"
              >
                Add new Project
              </Button>
            </Box>
          </Box>

          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Add a new Project
                </Typography>
                <TextField
                  name="projectName"
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  fullWidth
                  required
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  name="funder"
                  label="Funder"
                  value={funder}
                  onChange={(e) => setFunder(e.target.value)}
                  fullWidth
                  required
                  sx={{ marginBottom: "1rem" }}
                />
                <Autocomplete
                  options={bankCodes.map((bank) => bank.bankName)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="bankName"
                      label="Bank Name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      fullWidth
                      required
                      sx={{ marginBottom: "1rem" }}
                    />
                  )}
                  onInputChange={handleBankNameChange}
                />

                <TextField
                  name="accountNumber"
                  label="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  fullWidth
                  required
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  name="accountName"
                  label="Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  fullWidth
                  required
                  sx={{ marginBottom: "1rem" }}
                />
                {/* <TextField
                    name="balance"
                    label="Balance"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: "1rem" }}
                /> */}
                <Button
                  onClick={handleCreateProject}
                  color="success"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "adding..." : "Add Project"}
                </Button>
              </Box>
            </Box>
          </Modal>

          {projects &&
            projects.map((project, index) => (
              <Accordion
                expanded={expanded === `panel${Number(index) + 1}`}
                onChange={handleChange(`panel${Number(index) + 1}`)}
                key={index}
                sx={{ borderTop: "0.5px solid #83c5be" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${Number(index) + 1}bh-content`}
                  id={`panel${Number(index) + 1}bh-header`}
                >
                  <Typography
                    component={"span"}
                    sx={{
                      width: "33%",
                      flexShrink: 0,
                      borderLeft:
                        expanded === `panel${Number(index) + 1}` ? "5px solid #83c5be" : "none",
                      paddingLeft: expanded === `panel${Number(index) + 1}` ? "5px" : "initial",
                    }}
                  >
                    {project?.projectName}
                  </Typography>
                  <Typography component={"span"} sx={{ color: "text.secondary" }}>
                    <strong>Funder: </strong> {project?.funder}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "#f5f5f5" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid component={"span"} container spacing={2}>
                      <Grid component={"span"} item xs={6} md={4}>
                        <Box sx={{ mr: 2 }}>
                          <Typography
                            component={"span"}
                            variant="body2"
                            display="block"
                            gutterBottom
                            className="text-item-header"
                          >
                            Bank name
                          </Typography>
                          <Typography component={"span"} variant="body1" className="text-item">
                            {project?.account?.bankName}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid component={"span"} item xs={6} md={4}>
                        <Box sx={{ mr: 2 }}>
                          <Typography
                            component={"span"}
                            variant="body2"
                            display="block"
                            gutterBottom
                            className="text-item-header"
                          >
                            Account number
                          </Typography>
                          <Typography component={"span"} variant="body1" className="text-item">
                            {project?.account?.accountNumber}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid component={"span"} item xs={6} md={4}>
                        <Box sx={{ mr: 2 }}>
                          <Typography
                            component={"span"}
                            variant="body2"
                            display="block"
                            gutterBottom
                            className="text-item-header"
                          >
                            Account name
                          </Typography>
                          <Typography component={"span"} variant="body1" className="text-item">
                            {project?.account?.accountName}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid component={"span"} item xs={6} md={8}>
                        <Box sx={{ mr: 2 }}>
                          <Typography
                            component={"span"}
                            variant="body2"
                            display="block"
                            gutterBottom
                            className="text-item-header"
                          >
                            Balance
                          </Typography>
                          <Typography component={"span"} variant="body1" className="text-item">
                            {project?.account?.balance || "N/A"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Button
                        onClick={() =>
                          alert(`Contact Tech to delete the ${project.projectName} project`)
                        }
                        color="error"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
        </Card>
      ) : (
        <Typography sx={{ mt: 2 }}>No projects found.</Typography>
      )}
    </>
  );
};
