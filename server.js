require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRoutes=require('./routes/api');
const adminApiRoutes=require('./routes/admin_api');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- for form-data
//Routes
app.use('/api',apiRoutes);
app.use('/admin',adminApiRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
