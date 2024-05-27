import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled component for input fields representing the verification code
const CodeInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '& > *': {
    margin: theme.spacing(1),
    width: '3rem',
    textAlign: 'center',
  },
}));

// Styled component for dialog actions
const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  justifyContent: 'center',
}));

function VerificationDialog({ open, onClose, onVerify, email }) {
  // State to manage the verification code input
  const [code, setCode] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  // Effect to focus on the first input field when the component mounts or the code changes
  useEffect(() => {
    if (code.every((digit) => digit === '')) {
      inputRefs.current[0]?.focus();
    }
  }, [code]);

  // Handler function for input change
  const handleChange = (index) => (event) => {
    const newCode = [...code];
    const value = event.target.value;
    newCode[index] = value;
    setCode(newCode);

    // Move focus to the next input field or the previous one based on input value and index
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handler function to verify the entered code
  const handleVerify = async () => {
    try {
      // Send verification request to the server
      const resp = await fetch(`${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/users/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: code.join(''), // Combine the code digits into a single string
        }),
      });
      // Handle response if needed
    } catch (err) {
      console.log(err); // Log any errors that occur during the verification process
    } finally {
      // Reset the code input and trigger the onVerify callback
      setCode(Array(6).fill(''));
      onVerify(code.join('')); // Pass the entered code to the parent component for further processing
    }
  };

  // Handler function to close the dialog
  function onCloseDialog() {
    setCode(Array(6).fill('')); // Reset the code input
    onVerify(code.join('')); // Pass the entered code to the parent component for further processing
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Email Verification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the 6-digit code sent to your email to verify your account.
        </DialogContentText>
        {/* Input fields for entering the verification code */}
        <CodeInput>
          {code.map((digit, index) => (
            <TextField
              key={index}
              variant="outlined"
              value={digit}
              onChange={handleChange(index)}
              inputProps={{ maxLength: 1 }}
              inputRef={(el) => (inputRefs.current[index] = el)} // Ref for each input field
            />
          ))}
        </CodeInput>
      </DialogContent>
      <DialogActionsStyled>
        {/* Button to cancel the verification process */}
        <Button onClick={onCloseDialog} color="secondary">
          Cancel
        </Button>
        {/* Button to verify the entered code */}
        <Button onClick={handleVerify} color="primary" variant="contained">
          Verify
        </Button>
      </DialogActionsStyled>
    </Dialog>
  );
}

export default VerificationDialog;
