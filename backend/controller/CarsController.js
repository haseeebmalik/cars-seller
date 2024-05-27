const fs = require("fs"); // Node.js file system module to read/write files
const { promisify } = require("util"); // Util module to convert callback-based functions to promise-based
const Car = require("../model/Car"); // Import the Car model

const readFileAsync = promisify(fs.readFile); // Convert fs.readFile to a promise-based function
const writeFileAsync = promisify(fs.writeFile); // Convert fs.writeFile to a promise-based function

const CarsController = {
  // Function to get all cars by category with pagination
  getAllCarsByCategory: async (req, res) => {
    try {
      // Extract the category from the route parameters
      const { category } = req.params;

      // Extract page and limit from query parameters for pagination
      const { page, limit } = req.query;

      // Convert page and limit to integers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      // Read the cars data from the JSON file asynchronously
      const carsData = await readFileAsync("cars.json", "utf-8");
      
      // Parse the JSON string into a JavaScript object
      const cars = JSON.parse(carsData);

      // Calculate the start and end indices for pagination
      const startIndex = pageNumber * limitNumber;
      const endIndex = (pageNumber + 1) * limitNumber;

      // Filter the cars based on the specified category
      const filteredCars = cars.filter((car) => car.category === category);

      // Get the subset of filtered cars for the current page
      const paginatedCars = filteredCars.slice(startIndex, endIndex);

      // Return the paginated results as a JSON response
      res.status(200).json({
        data: paginatedCars, // Cars for the current page
        total: filteredCars.length, // Total number of cars in the specified category
        page: pageNumber, // Current page number
        totalPages: Math.ceil(filteredCars.length / limitNumber), // Total number of pages
      });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: "Something went wrong." });
    }
  },

  // Function to create a new car
  createCar: async (req, res) => {
    try {
      // Extract category, color, model, and carNumber from request body
      const { category, color, model, carNumber } = req.body;

      // Check if all required fields are provided
      if (!category || !color || !model || !carNumber) {
        return res.status(400).json({ message: "Please provide all the required fields." });
      }
      
      // Create a new car object from request body
      let newCar = req.body;
      
      // Read the existing cars data from the JSON file asynchronously
      let carsData = await readFileAsync("cars.json", "utf-8");
      carsData = JSON.parse(carsData);
      
      // Increment the IDs of existing cars
      let cars = carsData.map(car => ({ ...car, id: car.id + 1 }));
      
      // Set the new car's ID to 1
      newCar.id = 1;
      
      // Validate and create a new Car instance
      const newCarWithValidatedFields = new Car(newCar.id, newCar.category, newCar.color, newCar.model, newCar.carNumber);
      
      // Insert the new car data at the top
      cars.unshift(newCarWithValidatedFields);
      
      // Save the updated cars data to the JSON file asynchronously
      await writeFileAsync("cars.json", JSON.stringify(cars));
      
      // Send a success response
      res.status(200).json({ message: "New car added successfully." });
    } catch (err) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: "Something went wrong." });
    }
  },

  // Function to delete a car by ID
  deleteCarById: async (req, res) => {
    try {
      const { id } = req.params; // Extract the car ID from the route parameters
      
      // Read the existing cars data from the JSON file asynchronously
      let carsData = await readFileAsync("cars.json", "utf-8");
      carsData = JSON.parse(carsData);
      
      // Filter out the car with the specified ID
      const updatedCars = carsData.filter(car => car.id !== parseInt(id));
      
      // Save the updated cars data to the JSON file asynchronously
      await writeFileAsync("cars.json", JSON.stringify(updatedCars));
      
      // Send a success response
      res.status(200).json({ message: "Car deleted successfully." });
    } catch (err) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: "Something went wrong." });
    }
  },

  // Function to update a car by ID
  updateCarById: async (req, res) => {
    try {
      const { id } = req.params; // Extract the car ID from the route parameters
      const { category, color, model, carNumber } = req.body; // Extract car details from the request body

      // Check if all required fields are provided
      if (!category || !color || !model || !carNumber) {
        return res.status(400).json({ message: "Please provide all the required fields." });
      }
      
      // Read the existing cars data from the JSON file asynchronously
      let carsData = await readFileAsync("cars.json", "utf-8");
      carsData = JSON.parse(carsData);
      
      
      // Find the car index with the specified ID
      const carIndex = carsData.findIndex(car => car.id === parseInt(id));
      
      // Check if car with the specified ID exists
      if (carIndex === -1) {
        return res.status(404).json({ message: "Car not found." });
      }

      // Update the car details
      carsData[carIndex] = { id: parseInt(id), category, color, model, carNumber };
      
      // Save the updated cars data to the JSON file asynchronously
      await writeFileAsync("cars.json", JSON.stringify(carsData));
      
      // Send a success response
      res.status(200).json({ message: "Car updated successfully." });
    } catch (err) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: "Something went wrong." });
    }
  }
};

module.exports = CarsController; // Export the CarsController object for use in other parts of the application
