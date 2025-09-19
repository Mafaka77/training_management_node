const Banner=require('../models/banner_model');
const STATUS=require('../utils/httpStatus');
exports.getBanners=async (req,res)=>{
    try{
        const banners=await Banner.find({}).sort({createdAt:-1});
        res.status(STATUS.OK).json({
            status:STATUS.OK,
            banners
        });
    }catch(err){
        console.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status:STATUS.INTERNAL_SERVER_ERROR,
            message:'Server Error'
        });
    }
}