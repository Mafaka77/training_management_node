const mongoose=require('mongoose');
const trainingRoomSchema = new mongoose.Schema({
    room_name:{
        type: String,
        required: true,
    },
    room_no:{
        type: String,
        required: false,
    },
    capacity:{
        type: Number,
        required: false,
    },
    details:{
        type:String,
        required:false,
    },
    latitude:{
        type: Number,
        required: false,
    },
    longitude:{
        type: Number,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('TrainingRoom', trainingRoomSchema);