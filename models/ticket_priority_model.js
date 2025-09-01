const mongoose= require('mongoose');
const TicketPrioritySchema= new mongoose.Schema({
    level:{
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: false
    },
    responseTimeHours:{
        type: Number,
        required: false
    },
    resolutionTimeHours:{
        type: Number,
        required: false
    }
});
module.exports= mongoose.model('TicketPriority', TicketPrioritySchema);