const mongoose= require('mongoose');
const TicketCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});
module.exports= mongoose.model('TicketCategory', TicketCategorySchema);