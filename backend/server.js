const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const carsRoutes = require('./routes/CarsRoutes');

const app = express();
const PORT = 5000;

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use('/users', userRoutes);
app.use('/cars', carsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});