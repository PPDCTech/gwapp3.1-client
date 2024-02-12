import React from "react";
import {
  Typography,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const FilterRequisitions = () => {
  let hold;

  return (
    <>
      <Accordion sx={{ border: "0.2px solid #F0FDF9" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Search Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Filter components go here */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={filters.title}
                onChange={handleChangeFilter}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={filters.userName}
                onChange={handleChangeFilter}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Select
                fullWidth
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleChangeFilter}
              >
                <MenuItem value="">All</MenuItem>
                {/* Add other status options */}
              </Select>
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChangeFilter}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChangeFilter}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button color="info" variant="outlined" onClick={filterRequisitions}>
                Search
              </Button>
              <Button
                sx={{ ml: 2 }}
                color="warning"
                variant="outlined"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
