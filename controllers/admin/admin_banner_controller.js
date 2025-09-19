const Banner=require('../../models/banner_model');
const STATUS=require('../../utils/httpStatus');
const fs = require('fs');
const path = require('path');
exports.uploadBanner=async (req,res)=>{
    const {title,imageUrl}=req.body;
    try{
        if(!req.file){
            return res.status(STATUS.OK).json({message:'No file uploaded',status:STATUS.BAD_REQUEST});
        }
        const banner=new Banner({
            // imageUrl:`/uploads/${req.file.filename}`,
            image_url:`/uploads/${req.file.filename}`,
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
exports.deleteBanner = async (req, res) => {
    const { id } = req.params;
    try {
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(STATUS.NOT_FOUND).json({ message: 'Banner not found', status: STATUS.NOT_FOUND });
        }

        // Remove the image file from the server
        if (banner.image_url) {
            const filePath = path.join(__dirname, '../../', banner.image_url);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.warn('Image file not found or already deleted:', filePath);
                }
            });
        }

        await Banner.findByIdAndDelete(id);
        res.status(STATUS.OK).json({ message: 'Banner deleted successfully', status: STATUS.OK });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Server error', status: STATUS.INTERNAL_SERVER_ERROR });
    }
}

