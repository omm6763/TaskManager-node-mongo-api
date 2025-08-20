// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/UserRoutes');
const taskRoutes = require('./routes/TaskRoutes');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
connectDB();


// Routes
app.use('/users', userRoutes);  // All user routes will start with /users
app.use('/tasks', taskRoutes);  // All task routes will start with /tasks

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
