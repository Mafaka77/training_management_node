const mongoose = require("mongoose");
const OrderType = require("../models/order_type_model");

// Define role data
const orderType = [
    { order_type: "release" },
    { order_type: "nomination" },
    { order_type: "selected" },
];

// Seed roles into the database
const seedOrderType = async () => {
    try {
        await OrderType.deleteMany();
        const insertedOrderTypes = await OrderType.insertMany(orderType);
        console.log("Order Type seeded successfully!");

    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

module.exports = seedOrderType;