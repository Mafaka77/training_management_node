const mongoose=require('mongoose');
const constituencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    districts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'District'
    }
});
module.exports=mongoose.model('Constituency',constituencySchema);