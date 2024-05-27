import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarsByCategory, setCategory } from "./carsSlice";
import EditCarModal from "./editCarModel";
import "./index.css";
import Heading from "./MainHeading";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import ListCarModal from "./ListCarModel";

// Custom component for pagination actions
function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

function CarTable() {
  const dispatch = useDispatch();
  const { data, total, category, status } = useSelector((state) => state.cars);
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carAdded, setCarAdded] = useState(false);
  const [carUpdated, setCarUpdated] = useState(false);
  const [carDeleted, setCarDeleted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCarData, setEditCarData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  // Fetch cars data when component mounts or category/page/rowsPerPage changes
  useEffect(() => {
    let token = user.token;
    dispatch(fetchCarsByCategory({ category, page, rowsPerPage, token }));
  }, [dispatch, category, page, rowsPerPage, user]);

  // Load refresh data if new car is being added, updated or deleted
  useEffect(() => {
    if (carAdded || carUpdated || carDeleted) {
      let token = user.token;
      dispatch(fetchCarsByCategory({ category, page, rowsPerPage, token }));
    }
  }, [
    dispatch,
    category,
    page,
    rowsPerPage,
    user,
    carAdded,
    carUpdated,
    carDeleted,
  ]);

  // Event handler for changing page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Event handler for changing rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Event handler for changing category
  const handleCategoryChange = (event) => {
    dispatch(setCategory(event.target.value));
    setPage(0);
  };

  // Function to open edit modal
  const handleEditModalOpen = (car) => {
    setEditCarData(car);
    setIsEditModalOpen(true);
  };

  // Function to close edit modal
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  // Function to handle update
  const handleUpdate = async (updatedCarData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/cars/${updatedCarData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user.token}`,
          },
          body: JSON.stringify(updatedCarData),
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Car updated successfully!");
        setCarUpdated(true); // Trigger data refresh
      } else {
        setSnackbarMessage("Failed to update car.");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("An error occurred.");
    } finally {
      setSnackbarOpen(true); // Show Snackbar
      setCarUpdated(false);
    }
  };

  // Function to handle delete button click
  const handleDelete = async (carId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/cars/${carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage("Car deleted successfully!");
        setCarDeleted(true); // Trigger data refresh
      } else {
        setSnackbarMessage("Failed to delete car.");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("An error occurred.");
    } finally {
      setSnackbarOpen(true); // Show Snackbar
      setCarDeleted(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Calculate the number of empty rows to maintain consistent height
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length);

  return (
    <Box>
      <Heading />
      <div className="listCarButton">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Car
        </Button>
        <ListCarModal
          open={isModalOpen}
          handleClose={handleClose}
          setCarAdded={setCarAdded}
          carAdded={carAdded}
          carData={editCarData}
          setCarData={setEditCarData}
        />
        <EditCarModal
          open={isEditModalOpen}
          handleClose={handleEditModalClose}
          carData={editCarData}
          handleUpdate={handleUpdate}
        />
      </div>

      {/* Dropdown to select car category */}
      <FormControl fullWidth margin="normal">
        <Select
          labelId="category-label"
          id="category"
          value={category}
          onChange={handleCategoryChange}
        >
          <MenuItem value="hatchback">Hatchback</MenuItem>
          <MenuItem value="sedan">Sedan</MenuItem>
          <MenuItem value="SUV">SUV</MenuItem>
        </Select>
      </FormControl>

      {/* Table to display cars data */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableBody>
            {/* Show loading spinner when data is being fetched */}
            {status === "loading" ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {/* Display table header */}
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Car Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>

                {/* Display cars data */}
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell>{row.carNumber}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditModalOpen(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(row.id)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {/* Add empty rows to maintain consistent height */}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          {/* Table pagination */}
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={5}
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CarTable;
