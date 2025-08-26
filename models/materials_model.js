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
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Materials = mongoose.model('Materials', materialsSchema);