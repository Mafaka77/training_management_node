const mongoose=require('mongoose');
const BannerSchema=new mongoose.Schema({
    image_url:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:false,
    },
    is_active:{
        type:Boolean,
        enum:['true','false'],
        default:true,
    },
});
module.exports=mongoose.model('Banner',BannerSchema);