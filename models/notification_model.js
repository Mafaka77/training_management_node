const mongoose=require('mongoose');
const notificationSchema=new mongoose.Schema({
    recipient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false
    },
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    type:{
        type:String,
        enum:["Training","Ticket"],
    },
    title:{
        type:String,
        required:false,
    },
    message:{
        type: String,
        required:false,
    },
    target_url:{
        type:String,
        required:true,
    },
    is_read:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Notification',notificationSchema);