const mongoose=require('mongoose');
const materialsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:false,
    },
    file_name: {
        type: String,
        required: true,
        unique: true
    },
    file_size:{
        type:String,
        required:false
    },
    file_url: {
        type: String,
        required: true
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true
    },
    mime_type: {
        type: String,
        required: false
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports= mongoose.model('Materials', materialsSchema);