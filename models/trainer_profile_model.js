const mongoose= require('mongoose');
const TrainerProfileSchema = new mongoose.Schema({
    expertise:{
        type: String,
        required: false
    },
    qualification:{
        type: String,
        required: false
    },
    profile_picture:{
        type: String,
        required: false
    },
    experience:{
        type: String,
        required: false
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports= mongoose.model('TrainerProfile', TrainerProfileSchema);
