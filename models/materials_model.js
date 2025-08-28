const mongoose=require('mongoose');
const materialsSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: true,
        unique: true
    },
    file_url: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingCourse',
        required: true
    },
    mime_type: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports= mongoose.model('Materials', materialsSchema);