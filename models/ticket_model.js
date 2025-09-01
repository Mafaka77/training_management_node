const mongoose= require('mongoose');
const TicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who raised it
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    category: { type: String, enum: ["Technical", "Training", "General"], default: "General" },
    replies: [
        {
            message: String,
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports= mongoose.model('Ticket', TicketSchema);