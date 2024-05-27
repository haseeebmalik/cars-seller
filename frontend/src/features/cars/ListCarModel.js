import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";

// Predefined categories for car selection
const categories = [
  { value: "sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
];

// Styles for the modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function ListCarModal({ open, handleClose, setCarAdded, carAdded }) {
  // State for form data
  const [carData, setCarData] = useState({
    category: "",
    color: "",
    model: "",
    carNumber: "",
  });

  // State for form errors
  const [errors, setErrors] = useState({});

  // State for Snackbar visibility
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // State for Snackbar message
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Get the user data from the Redux store
  const user = useSelector((state) => state.user);

  // Function to validate form inputs
  const validate = () => {
    const errors = {};
    if (!carData.category) errors.category = "Category is required";
    if (!carData.color) errors.color = "Color is required";
    if (!carData.model) errors.model = "Model is required";
    if (!carData.carNumber) errors.carNumber = "Number is required";
    return errors;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Make API request to create a new car
      const resp = await fetch(`${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/cars/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
        body: JSON.stringify(carData),
      });

      // Check response status and set appropriate Snackbar message
      if (resp.status === 200) {
        setCarAdded(true);
        setSnackbarMessage("Car created successfully!");
      } else {
        setSnackbarMessage("Failed to create car.");
      }

      // Show Snackbar
      setSnackbarOpen(true);
      setCarData({
        category: "",
        color: "",
        model: "",
        carNumber: "",
      })
      handleClose();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("An error occurred.");
      setSnackbarOpen(true);
    } finally {
      setCarAdded(false);
      handleClose();
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({
      ...carData,
      [name]: value,
    });
  };

  // Function to handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Add New Car
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
              select
              label="Car Category"
              fullWidth
              margin="normal"
              name="category"
              value={carData.category}
              onChange={handleInputChange}
              error={!!errors.category}
              helperText={errors.category}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Car Color"
              fullWidth
              margin="normal"
              name="color"
              value={carData.color}
              onChange={handleInputChange}
              error={!!errors.color}
              helperText={errors.color}
            />
            <TextField
              label="Car Model"
              fullWidth
              margin="normal"
              name="model"
              value={carData.model}
              onChange={handleInputChange}
              error={!!errors.model}
              helperText={errors.model}
            />
            <TextField
              label="Car Number"
              fullWidth
              margin="normal"
              name="carNumber"
              value={carData.carNumber}
              onChange={handleInputChange}
              error={!!errors.carNumber}
              helperText={errors.carNumber}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ListCarModal;
