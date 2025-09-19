const Banner=require('../../models/banner_model');
const STATUS=require('../../utils/httpStatus');
exports.uploadBanner=async (req,res)=>{
    const {title,imageUrl}=req.body;
    try{
        // if(!req.file){
        //     return res.status(STATUS.OK).json({message:'No file uploaded',status:STATUS.BAD_REQUEST});
        // }
        const banner=new Banner({
            // imageUrl:`/uploads/${req.file.filename}`,
            image_url:imageUrl,
            title:title || '',
            uploadedAt:new Date()
        });
        await banner.save();
        res.status(STATUS.OK).json({message:'Banner uploaded successfully',banner,status:STATUS.CREATED});
    }catch(error){
        console.error('Error uploading banner:',error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Server error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

