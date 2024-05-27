import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const EditCarModal = ({ open, handleClose, carData, handleUpdate , carUpdated,
  setCarUpdated
  }) => {
  const [carCategory, setCarCategory] = useState("");
  const [carColor, setCarColor] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carNumber, setCarNumber] = useState("");

  // Fill fields with existing data when modal opens
  useEffect(() => {
      if (carData) {
      setCarCategory(carData.category);
      setCarColor(carData.color);
      setCarModel(carData.model);
      setCarNumber(carData.carNumber);
    }
  }, [carData]);

  // Function to handle form submission for update
  const handleSubmit = () => {
    // Prepare updated data object
    const updatedCarData = {
      ...carData,
      category: carCategory,
      color: carColor,
      model: carModel,
      carNumber: carNumber,
    };
    // Call the update function passed from the parent component
    handleUpdate(updatedCarData);
    // Close the modal
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        }}
      >
        <Typography variant="h6" component="h2">
          Edit Car
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            select
            label="Car Category"
            fullWidth
            margin="normal"
            value={carCategory}
            onChange={(e) => setCarCategory(e.target.value)}
          >
            {/* Replace this with your category options */}
            <MenuItem value="sedan">Sedan</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="hatchback">Hatchback</MenuItem>
          </TextField>
          <TextField
            label="Car Color"
            fullWidth
            margin="normal"
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
          />
          <TextField
            label="Car Model"
            fullWidth
            margin="normal"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
          />
          <TextField
            label="Car Number"
            fullWidth
            margin="normal"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCarModal;
