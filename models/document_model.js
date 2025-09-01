const mongoose=require('mongoose');
const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    fileUrl: { type: String, required: true }, // stored in S3 / local storage / GCP bucket
    fileType: String, // pdf, docx, ppt, etc.
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accessRoles: [{ type: String, enum: ["Admin", "Trainer", "Trainee"] }], // who can view/download
    createdAt: { type: Date, default: Date.now }
});
module.exports=mongoose.model('Document', DocumentSchema);
