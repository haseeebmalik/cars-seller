const express = require('express');
const router = express.Router();
const CarsController = require('../controller/CarsController');
const verifyToken = require("../utils").verifyToken;

// Route to get all cars by category with pagination
router.get('/:category', verifyToken, CarsController.getAllCarsByCategory);

// Route to create a new car
router.post('/create', verifyToken, CarsController.createCar);

// Route to delete a car by ID
router.delete('/:id', verifyToken, CarsController.deleteCarById);

// Route to update a car by ID
router.put('/:id', verifyToken, CarsController.updateCarById);

module.exports = router;
