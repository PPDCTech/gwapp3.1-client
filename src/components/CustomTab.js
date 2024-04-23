import React from "react";
import { Box } from "@mui/material";

export const CustomTab = ({ label, isActive, onClick }) => {
  return (
    <Box
      sx={{
        padding: "10px",
        cursor: "pointer",
        borderBottom: isActive ? "2px solid blue" : "2px solid transparent",
        color: isActive ? "blue" : "black",
        marginRight: "20px", 
      }}
      onClick={onClick}
    >
      {label}
    </Box>
  );
};
