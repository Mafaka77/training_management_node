const mongoose = require("mongoose");
require('./trainer_profile_model');
const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        required: false,
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
        type: String,
        required: false,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false
    },
    gender: {
        type: String,
        enums: ["Male", "Female", "Others"],
        required: false,
    },
    designation: {
        type: String,
        required: false
    },
    mandatory_completion: {
        type: Boolean,
        required: true,
        default: false
    },
    is_blacklisted: {
        type: Boolean,
        default: false
    },
    blacklist_details: {
        reason: String,
        start_date: Date,
        end_date: Date,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    dob: {
        type: Date,
        required: false,
    },
    is_govt_employee: {
        type: Boolean,
        default: true
    },
    date_of_entry: {
        type: Date,
        required: false,
    },
    date_of_superannuation: {
        type: Date,
        required: false,
    },
    recruitment: {
        type: String,
        enums: ["Direct", "Regularisation", "Absorption"],
        required: false,
    },
    confirmation: {
        type: String,
        enums: ["Confirmed", "Not Confirmed"],
        default: "Confirmed",
    },
    service_cadre: {
        type: String,
        required: false,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],

});
userSchema.virtual('trainerProfile', {
    ref: 'TrainerProfile',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
})
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema);