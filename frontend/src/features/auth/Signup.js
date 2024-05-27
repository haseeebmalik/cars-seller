import React, { useState } from 'react'; // Import React and useState hook
import { Box, Button, TextField, Typography, Container } from '@mui/material'; // Import Material-UI components
import { styled } from '@mui/material/styles'; // Import styled from Material-UI for custom styling
import VerificationDialog from './VerificationDialog'; // Import VerificationDialog component

// Styled component for the container using Material-UI's styled utility
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(8), // Add top margin
}));

// Styled component for the form
const StyledForm = styled('form')(({ theme }) => ({
  width: '100%', // Full width
  marginTop: theme.spacing(1), // Add top margin
}));

// Styled component for the submit button
const StyledSubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2), // Add margin
}));

// Signup component
function Signup() {
  // State for managing dialog visibility and form data
  const [openVerification, setOpenVerification] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target; // Get the name and value of the input
    setFormData(prevState => ({
      ...prevState, // Copy previous state
      [name]: value // Update the specific field
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    // Access form data from state
    const { name, email, password } = formData;

    // Perform validation or other logic as needed
    try {
      const resp = await fetch(`${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // On successful signup, open the verification dialog
      if (resp.status === 200) {
        setOpenVerification(true);
      }
    } catch(err) {
      console.log(err); // Log any error that occurs during fetch
    }
  };

  // Handle closing the verification dialog
  const handleCloseVerification = () => {
    setOpenVerification(false);
  };

  // Handle verifying the code
  const handleVerifyCode = (code) => {
    // Handle verification logic here
    console.log('Verification code:', code);
    // After verification, close the dialog
    setOpenVerification(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledContainer>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <StyledSubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign Up
          </StyledSubmitButton>
        </StyledForm>
      </StyledContainer>

      {/* Verification dialog */}
      <VerificationDialog
        open={openVerification}
        onClose={handleCloseVerification}
        onVerify={handleVerifyCode}
        email={formData.email}
      />
    </Container>
  );
}

export default Signup; // Export the Signup component as the default export
