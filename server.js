const express = require("express");
const app = express();
app.use(express.json()); // This is the line you're probably missing.


// Define a port
const PORT = process.env.PORT || 5000;

// A simple middleware that logs the request method and URL
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass the request to the next middleware/function
});

const accountRoutes = require("./routes/accounts.js");

// Use routes
app.use("/accounts", accountRoutes);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
