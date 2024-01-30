// EditReqModal.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import requisitionDefaults from "src/services/requisitionDefault";

const EditReqModal = ({ open, onClose, requisition, onSave }) => {
  const [editedRequisition, setEditedRequisition] = useState({
    ...requisitionDefaults,
    ...requisition,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedRequisition((prevRequisition) => ({
      ...prevRequisition,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Call an API to save the edited requisition
    onSave(editedRequisition);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Requisition</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={editedRequisition.title}
          onChange={handleInputChange}
          fullWidth
        />
        {/* Add more fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReqModal;
