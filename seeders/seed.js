require("dotenv").config();
const mongoose = require("mongoose");
const seedRoles = require("./roles_seeder");
const districtSeeder = require("./district_seeder");
const trainingCategorySeeder=require('./training_category_seeder');
const groupSeeder=require('./group_seeder');
const connectDB = require("../config/db");
const seedData=async()=>{
    try {
        // Connect to MongoDB
        await connectDB();
        await seedRoles();
        await districtSeeder();
        await trainingCategorySeeder();
        await groupSeeder();
        console.log('All data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }finally {
        // Close the connection
        await mongoose.connection.close();
    }

};
seedData();