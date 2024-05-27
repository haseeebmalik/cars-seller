require("dotenv").config(); // Load environment variables from .env file
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

let SECRET_KEY = process.env.SECRET_KEY; // Get the secret key from environment variables

const utils = {
  // Function to generate a random 6-digit verification code
  generateVerificationCode: () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a number between 100000 and 999999
  },

  // Function to get the current timestamp in milliseconds
  getCurrentTimestamp: () => {
    return new Date().getTime(); // Return the current time in milliseconds since the Unix Epoch
  },

  // Function to generate a JWT token for a user
  generateJwtToken: (user) => {
    // Create a token with the user's ID and email, signed with the secret key, that expires in 1 hour
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    // Add the "Bearer " prefix to the token and return it
    return `Bearer ${token}`;
  },
  // Middleware to verify a JWT token

  verifyToken: (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers["authorization"];

    // Check if token exists
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Trim the token and check if it includes "Bearer" prefix
    const trimmedToken = token.trim();

    if (!trimmedToken.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove the "Bearer " prefix from the token
    const tokenWithoutBearer = trimmedToken.substring(7);

    // Verify the token
    jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });

      // Save user info for the next middleware
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      next();
    });
  },
};

module.exports = utils; // Export the utils object for use in other parts of the application
