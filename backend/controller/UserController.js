const fs = require("fs"); // Node.js file system module to read/write files
const { promisify } = require("util"); // Util module to convert callback-based functions to promise-based
const User = require("../model/User"); // Import the User model
const { generateVerificationCode, getCurrentTimestamp, generateJwtToken } = require("../utils"); // Import utility functions
const writeFileAsync = promisify(fs.writeFile); // Convert fs.writeFile to a promise-based function
const readFileAsync = promisify(fs.readFile); // Convert fs.readFile to a promise-based function
const transporter = require("../transporter"); // Import the email transporter for sending emails

// Controller object containing the user-related functions
const UserController = {
  // Function to handle user signup
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body; // Extract name, email, and password from request body
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all the required fields." }); // Return error if any field is missing
      }
      
      // Read the existing user data from the JSON file asynchronously
      let userData = await readFileAsync("users.json", "utf-8");
      userData = JSON.parse(userData);

      // Check if a user already exists with the provided email
      const userExists = userData.some((user) => user.email === email);
      if (userExists) {
        return res.status(400).json({ message: "User already exists with this email address." });
      }

      const id = userData.length + 1; // Generate a new user ID
      const verificationCode = generateVerificationCode().toString(); // Generate a verification code
      const codeExpireTime = getCurrentTimestamp() + 60000; // Set verification code expiry time (1 minute from now)

      // Create a new user object
      const newUser = new User(id, name, email, password, verificationCode, codeExpireTime);
      userData.push(newUser); // Add the new user to the user data array

      // Save the updated user data to the JSON file asynchronously
      await writeFileAsync("users.json", JSON.stringify(userData));

      // Define email options for sending the verification code
      const mailOptions = {
        from: "muhammad.haseeb@devprovider.com",
        to: email,
        subject: "Verification Code for Signup",
        text: `Your verification code is ${verificationCode}`,
      };

      // Send the verification email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      // Set a timeout to delete the user if not verified within the specified time (1 minute)
      setTimeout(async () => {
        let userData = await readFileAsync("users.json", "utf-8");
        userData = JSON.parse(userData);

        const userIndex = userData.findIndex((u) => u.email === email);
        if (userIndex !== -1 && !userData[userIndex].isVerified) {
          userData.splice(userIndex, 1); // Remove the user from the array if not verified

          await writeFileAsync("users.json", JSON.stringify(userData)); // Save the updated user data
        }
      }, 60000);

      // Send success response
      res.status(200).json({ message: "Verification code sent to your email" });
    } catch (err) {
      console.error("Error during signup:", err);
      res.status(500).json({ message: "Something went wrong" }); // Send error response
    }
  },

  // Function to handle user verification
  verify: async (req, res) => {
    try {
      const { email, verificationCode } = req.body; // Extract email and verification code from request body
      if (!email || !verificationCode) {
        return res.status(400).json({ message: "Please provide all the required fields" }); // Return error if any field is missing
      }

      // Read the existing user data from the JSON file asynchronously
      let userData = await readFileAsync("users.json", "utf-8");
      userData = JSON.parse(userData);

      const userIndex = userData.findIndex((u) => u.email === email); // Find the user index by email
      const currentTime = getCurrentTimestamp(); // Get the current timestamp

      // Find the user by email and verification code
      const user = userData.find((user) => user.email === email && user.verificationCode === verificationCode);
      if (!user) {
        return res.status(400).json({ message: "Invalid verification code" }); // Return error if verification code is invalid
      }
      if (user.codeExpireTime < currentTime) {
        return res.status(400).json({ message: "Verification code expired" }); // Return error if verification code has expired
      }

      userData[userIndex].isVerified = true; // Set the user as verified

      // Save the updated user data to the JSON file asynchronously
      await writeFileAsync("users.json", JSON.stringify(userData));
      res.status(200).json({ message: "Verification successful" }); // Send success response
    } catch (err) {
      console.error("Error during verification:", err);
      res.status(500).json({ message: "Something went wrong" }); // Send error response
    }
  },

  // Function to handle user login
  login: async (req, res) => {
    try {
      const { email, password } = req.body; // Extract email and password from request body
      if (!email || !password) {
        return res.status(400).json({ message: "Please provide all the required fields" }); // Return error if any field is missing
      }

      // Read the existing user data from the JSON file asynchronously
      let userData = await readFileAsync("users.json", "utf-8");
      userData = JSON.parse(userData);

      // Find the user by email and password
      const user = userData.find((user) => user.email === email && user.password === password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" }); // Return error if email or password is invalid
      }

      const token = generateJwtToken(user); // Generate a JWT token for the user
     
      const userIndex = userData.findIndex((u) => u.email === email); // Find the user index by email
      if (userIndex !== -1) {
        userData[userIndex].token = token; // Save the token in user data

        await writeFileAsync("users.json", JSON.stringify(userData)); // Save the updated user data to the JSON file
      }

      // Send success response with user details and token
      res.status(200).json({ name: user.name, email: user.email, token });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Something went wrong" }); // Send error response
    }
  },
};

module.exports = UserController; // Export the UserController object for use in other parts of the application
