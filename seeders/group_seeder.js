const mongoose = require("mongoose");
const Group=require("../models/group_model");
const bcrypt = require("bcryptjs");

// Define role data
const group = [
    { group_name: "A" },
    { group_name: "B" },
    { group_name: "C" },
    { group_name: "D" },
    { group_name: "NGO" },

];

// Seed roles into the database
const seedGroup = async () => {
    try {
        await Group.deleteMany();
        const insertedRoles = await Group.insertMany(group);
        console.log("Group seeded successfully!");

    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

module.exports = seedGroup;
