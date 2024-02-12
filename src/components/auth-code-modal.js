import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AuthCodeInput from "./auth-code-input";

const AuthCodeInputModal = ({ open, onClose, onSubmit }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    if (value) {
      onSubmit(value);
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="auth-code-input-modal"
      aria-describedby="auth-code-input-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography sx={{ mb: 2 }}
variant="h6"
gutterBottom>
          Enter the code sent to your email
        </Typography>

        <AuthCodeInput length={6}
onChange={setValue} />

        <Button
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
          color="info"
          variant="contained"
        >
          {loading ? "Please wait..." : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthCodeInputModal;
