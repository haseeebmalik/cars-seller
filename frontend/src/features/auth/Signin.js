import React, { useState } from "react"; // Import React and useState hook
import { Box, Button, TextField, Typography, Container } from "@mui/material"; // Import Material-UI components
import { styled } from "@mui/material/styles"; // Import styled from Material-UI for custom styling
import { setUser } from "../../features/auth/userSlice"; // Import setUser action from userSlice
import { useDispatch } from "react-redux"; // Import useDispatch hook from react-redux
import { useHistory } from "react-router-dom"; // Import useHistory hook from react-router-dom

// Styled component for the container using Material-UI's styled utility
const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(8), // Add top margin
}));

// Styled component for the form
const StyledForm = styled("form")(({ theme }) => ({
  width: "100%", // Full width
  marginTop: theme.spacing(1), // Add top margin
}));

// Styled component for the submit button
const StyledSubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2), // Add margin
}));

// Signin component
function Signin() {
  const dispatch = useDispatch(); // Initialize dispatch
  const history = useHistory(); // Initialize history
  const [formData, setFormData] = useState({
    email: "", // Initial state for email
    password: "", // Initial state for password
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input
    setFormData((prevState) => ({
      ...prevState, // Copy previous state
      [name]: value, // Update the specific field
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    try {

      let resp = await fetch(`${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/users/login`, {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      if (resp.status === 200) { // Check if the response status is 200 (OK)
        let data = await resp.json(); // Parse the JSON response
        let reduxData = {
          name: data.name,
          email: data.email,
          token: data.token,
        };
        dispatch(setUser(reduxData)); // Dispatch the setUser action with the received data
        history.push("/"); // Redirect to the home page
      } else {
        // Handle sign-in error, e.g., show error message
        console.log("Sign-in failed", resp); // Log the error response
      }
    } catch (err) {
      console.log(err); // Log any error that occurs during fetch
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledContainer>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Sign In
          </StyledSubmitButton>
        </StyledForm>
      </StyledContainer>
    </Container>
  );
}

export default Signin; // Export the Signin component as the default export
