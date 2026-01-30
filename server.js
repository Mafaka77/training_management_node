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

connectDB();
dotenv.config();
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccount.json";
const absCredPath = path.isAbsolute(credPath) ? credPath : path.join(process.cwd(), credPath);
const serviceAccount = JSON.parse(fs.readFileSync(absCredPath, "utf8"));
if (!admin.apps.length) {
    
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const fcm = admin.messaging();
const userTokens = new Map(); // userId -> Set(tokens)
// Middleware
app.set("trust proxy", 1);

const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

// 🔥 ABSOLUTELY REQUIRED FOR PASSENGER
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- for form-data
const uploadsPath = path.join(__dirname, 'uploads');
console.log('[server] serving uploads from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use('/api', apiRoutes);
app.use('/admin/api', adminApiRoutes);
// Serve Vue 3 frontend
const frontendPath = path.join(__dirname, "dist/spa");
app.use(express.static(frontendPath));
// Catch-all route to serve index.html for SPA
app.get(/.*/,(req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
