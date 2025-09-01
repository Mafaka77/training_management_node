const mongoose= require('mongoose');
const ManualSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileUrl: String, // PDF / DOC upload
    createdAt: { type: Date, default: Date.now }
});
module.exports= mongoose.model('UserManual', ManualSchema);