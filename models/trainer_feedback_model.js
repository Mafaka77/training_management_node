const mongoose= require('mongoose');
const TrainerFeedback= new mongoose.Schema({
    feedback:{
        type: String,
        required: false
    },
    ratings: {
        type: Number,
        required: false
    },
    traineeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    trainingCourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingCourse',
        required: true
    },
});
module.exports= mongoose.model('TrainerFeedback', TrainerFeedback);