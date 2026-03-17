const mongoose = require("mongoose");
const TrainingCategory = require('../models/training_category_model');
// Define role data
const category = [
    { name: "Foundation" },
    { name: "In-Service" },
    { name: "Specialized" },
];
const dataSeed = async () => {
    try {
        await TrainingCategory.deleteMany();
        await TrainingCategory.insertMany(category);
        console.log("Training Categories seeded successfully!");
    } catch (e) {
        console.error("❌ Error seeding data:", e.message);
        process.exit(1);
    }
};
module.exports = dataSeed;