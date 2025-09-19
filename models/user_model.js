const mongoose= require("mongoose");
require('./trainer_profile_model');
const userSchema= new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    profile_picture:{
        type:String,
        required:false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        required: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    department: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
   gender:{
        type:String,
        enums:["Male","Female"],
        required: false,
   },
    designation:{
        type:String,
        required: false
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }]
});
userSchema.virtual('trainerProfile', {
    ref:'TrainerProfile',
    localField:'_id',
    foreignField:'user_id',
    justOne: true
})
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true});
module.exports = mongoose.model('User', userSchema);