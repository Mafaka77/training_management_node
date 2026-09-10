const mongoose = require("mongoose");
const departmentParentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('DepartmentParent', departmentParentSchema);