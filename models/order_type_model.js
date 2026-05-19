const mongoose = require('mongoose');
const orderTypeSchema = new mongoose.Schema({
    order_type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OrderType', orderTypeSchema);