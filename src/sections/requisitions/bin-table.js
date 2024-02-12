import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { binRequisitions, destroyRequisition } from "src/services/api/requisition.api";
import { getCurrencySign } from "src/utils/format-currency";
import { formatAmount } from "src/services/helpers";
import { formatDate } from "src/utils/format-date";

const PAGE_SIZE = 10;

const BinRequisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBinRequisitions();
  }, []); // Fetch all requisitions on initial render

  const fetchBinRequisitions = async () => {
    setIsLoading(true);
    try {
      const response = await binRequisitions();
      setRequisitions(response.data);
    } catch (error) {
      console.error("Error fetching bin requisitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestroy = async (requisitionId) => {
    try {
      await destroyRequisition(requisitionId);
      // Remove the requisition from the list after deletion
      setRequisitions((prevRequisitions) =>
        prevRequisitions.filter((req) => req._id !== requisitionId)
      );
    } catch (error) {
      console.error("Error destroying requisition:", error);
    }
  };

  const pageCount = Math.ceil(requisitions.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayedRequisitions = requisitions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "45%" }}>Title</TableCell>
              <TableCell sx={{ width: "15%" }}>Amount</TableCell>
              <TableCell sx={{ width: "15%" }}>Raised By</TableCell>
              <TableCell sx={{ width: "15%" }}>Date</TableCell>
              <TableCell sx={{ width: "10%" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRequisitions.map((req) => (
              <TableRow key={req._id}>
                <TableCell>{req.title}</TableCell>
                <TableCell>
                  {getCurrencySign(req?.currency)}
                  {formatAmount(Number(req?.total))}
                </TableCell>
                <TableCell>{req.user.name}</TableCell>
                <TableCell>{formatDate(req.date)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDestroy(req._id)}
                    disabled={isLoading}
                  >
                    Destroy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="center">
        <Button onClick={handlePrevPage} disabled={currentPage === 0 || isLoading}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === pageCount - 1 || isLoading}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default BinRequisitions;
