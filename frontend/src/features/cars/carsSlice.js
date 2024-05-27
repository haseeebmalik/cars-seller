import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch cars data by category from the server
export const fetchCarsByCategory = createAsyncThunk(
  "cars/fetchCarsByCategory",
  async ({ category, page, rowsPerPage, token }) => {
    // Send a GET request to the server to fetch cars data
    const response = await axios.get(`${process.env.REACT_APP_TEST_NODE_SERVER_DOMAIN}/cars/${category}`, {
      params: { page, limit: rowsPerPage },
      headers: {
        Authorization: `${token}`, // Include the token in the request headers
      },
    });
    // Return the fetched data
    return { category, data: response.data.data, total: response.data.total };
  }
);

// Redux slice for managing cars data
const carsSlice = createSlice({
  name: "cars",
  initialState: {
    data: [], // Array to store cars data
    total: 0, // Total number of cars
    category: "hatchback", // Default category
    status: "idle", // Status of the async operation (loading, succeeded, failed)
    error: null, // Error message in case of failure
  },
  reducers: {
    // Reducer to set the category
    setCategory(state, action) {
      state.category = action.payload; // Set the category
      state.data = []; // Reset the cars data
      state.total = 0; // Reset the total count
    },
    // Empty state reducer
    clearState(state) {
      state.data = [];
      state.total = 0;
      state.status = "idle";
      state.error = null;
      state.category = "hatchback";
    },
  },
  // Extra reducers to handle the async thunk lifecycle
  extraReducers: (builder) => {
    builder
      // Pending state when the async operation is in progress
      .addCase(fetchCarsByCategory.pending, (state) => {
        state.status = "loading"; // Set the status to loading
      })
      // Fulfilled state when the async operation is successful
      .addCase(fetchCarsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set the status to succeeded
        state.data = action.payload.data; // Update the cars data
        state.total = action.payload.total; // Update the total count
      })
      // Rejected state when the async operation fails
      .addCase(fetchCarsByCategory.rejected, (state, action) => {
        state.status = "failed"; // Set the status to failed
        state.error = action.error.message; // Store the error message
      });
  },
});

// Export actions and reducer from the slice
export const { setCategory, clearState } = carsSlice.actions;
export default carsSlice.reducer;
