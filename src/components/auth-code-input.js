import { Typography } from "@mui/material";
import React, { useRef, forwardRef } from "react";
import ReactCodeInput from "react-verification-code-input";

const placeHolderSpaces = [" ", " ", " ", " ", " ", " "];

const AuthCodeInput = ({ length, onChange }, ref) => {
  const inputsRef = useRef([]);

  const handleChange = (value) => {
    onChange(value);
  };

  const handlePaste = (pastedValue) => {
    [...pastedValue]
      .slice(0, length)
      .forEach((char, index) => (inputsRef.current[index].value = char));
    onChange(pastedValue);
  };

  return (
    <>
      <Typography variant="subtitle2"
sx={{ mb: 1 }}>6-Digit Code</Typography>

      <ReactCodeInput
        type="text"
        className="code-input"
        onChange={handleChange}
        autoFocus
        ref={ref}
        placeholder={placeHolderSpaces}
        onPaste={handlePaste}
        sx={{ "& > input": { marginRight: 10 } }}
      />
    </>
  );
};

export default forwardRef(AuthCodeInput);
