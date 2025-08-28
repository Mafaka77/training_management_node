const mongoose= require('mongoose');
const trainingCourseSchema = new mongoose.Schema({
    tc_topic: {
        type: String,
        required: true,
    },
    tc_description: {
        type: String,
        required: false,
    },
    tc_start_time: {
        type: String,
        required: true,
    },
    tc_end_time: {
        type: String,
        required: true,
    },
    tc_session: {
        type: Number, // Duration in days
        required: false
    },

    t_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true
    },
    trainer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qrVersion:{
        type: String,
        required: false,
        default: '1'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
trainingCourseSchema.virtual('materials', {
    ref: 'Materials',
    localField: '_id',
    foreignField: 'course'
})
trainingCourseSchema.set('toObject', { virtuals: true });
trainingCourseSchema.set('toJSON', { virtuals: true });
module.exports= mongoose.model('TrainingCourse', trainingCourseSchema);