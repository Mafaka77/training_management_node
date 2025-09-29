require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");   
const dotenv = require("dotenv");
const admin = require('firebase-admin');
const fs = require('fs');    // <-- added
const connectDB = require("./config/db");
const apiRoutes = require('./routes/api');
const adminApiRoutes = require('./routes/admin_api');
const app = express();

// Connect to MongoDB
connectDB();
dotenv.config();

// Initialize Admin SDK
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccount.json";
const absCredPath = path.isAbsolute(credPath) ? credPath : path.join(process.cwd(), credPath);
const serviceAccount = JSON.parse(fs.readFileSync(absCredPath, "utf8"));


if (!admin.apps.length) {
    
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
}

const fcm = admin.messaging();
// In-memory token store (swap with DB in production)
const userTokens = new Map(); // userId -> Set(tokens)
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- for form-data

// === Serve uploads directory at /uploads ===
// Use absolute path to avoid any relative path confusion
const uploadsPath = path.join(__dirname, 'uploads');
console.log('[server] serving uploads from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Routes (after static middleware)
app.use('/api', apiRoutes);
app.use('/admin', adminApiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
