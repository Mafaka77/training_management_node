const TrainingCourse=require('../../models/training_course_model');
const STATUS=require('../../utils/httpStatus');
const TrainingMaterial=require('../../models/materials_model');
exports.getMyTraining=async(req,res)=>{
 
    try{
        console.log("hello world")
        const trainerId=req.user.user.id;
        const myCourses=await TrainingCourse.find({trainer:trainerId}).populate('t_program');
        if(!myCourses){
            return res.status(STATUS.OK).json({
                status:STATUS.NOT_FOUND,
                message:'Training not Found'
            })
        }
        return res.status(STATUS.OK).json({
            status:STATUS.OK,
            data:myCourses
        });
    }catch(error){
        console.error('Error in getMyTraining:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status:STATUS.INTERNAL_SERVER_ERROR,
            message:'Server Error'
        });
    }
}

exports.uploadMaterial = async (req, res) => {

    try {
        const { courseId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(STATUS.OK).json({ message: "No files uploaded",status:STATUS.BAD_REQUEST });
        }

        // Ensure course exists
        const course = await TrainingCourse.findById(courseId);
        if (!course) {
            return res.status(STATUS.OK).json({ message: "Course not found",status:STATUS.NOT_FOUND});
        }

        // Save each file to Materials collection
        const savedMaterials = await Promise.all(
            req.files.map(async (file) => {
                const material = new TrainingMaterial({
                    file_name: file.filename,
                    file_url: `/uploads/${file.filename}`, // public url or local path
                    course: courseId,
                    mime_type: file.mimetype,
                });
                return await material.save();
            })
        );

        return res.status(STATUS.OK).json({
            message: "Materials uploaded successfully",
            status:STATUS.CREATED
        });
    } catch (err) {
        return res.status(STATUS.OK).json({ message: err.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
};
exports.getTrainingById=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const course=await TrainingCourse.findById(courseId).populate('t_program').populate('materials');
        if(!course){
            return res.status(STATUS.OK).json({
                status:STATUS.NOT_FOUND,
                message:'Course not found'
            });
        }
        return res.status(STATUS.OK).json({
            status:STATUS.OK,
            course
        });
    }catch(error){
        console.error('Error in getTrainingById:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status:STATUS.INTERNAL_SERVER_ERROR,
            message:'Server Error'
        });
    }
}