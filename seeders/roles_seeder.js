const mongoose = require("mongoose");
const Role = require("../models/role_model");
const User = require("../models/user_model");
const bcrypt = require("bcryptjs");

// Define role data
const roles = [
    { name: "Admin" },
    { name: "Trainer" },
    { name: "Trainee" },
    { name: "Guest" },
    {name:"Director"},

];

// Seed roles into the database
const seedRoles = async () => {
    try {
        await Role.deleteMany();
        const insertedRoles = await Role.insertMany(roles);
        console.log("Roles seeded successfully!");

        // Find the Admin role
        const adminRole = insertedRoles.find(role => role.name === "Admin");

        // Hash the password
        const hashedPassword = await bcrypt.hash("password", 10);
await User.deleteMany(); // Clear existing users before creating a new one
        // Create the admin user
        const adminUser = new User({
            full_name: "Admin User",
            email: "admin@email.com",
            password: hashedPassword, // Store hashed password
            mobile: 1234567890, // Example mobile number
            roles: [adminRole._id] // Assign Admin role
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

module.exports = seedRoles;
