const TrainerFeedback= require('../../models/trainer_feedback_model');
const STATUS= require('../../utils/httpStatus');

exports.feedback=async (req, res)=>{
    try{
        const {feedback, ratings, traineeId, trainerId, trainingCourseId}= req.body;
        const trainee=req.user.user.id;
        if( !feedback || !trainerId || !trainingCourseId){
            return res.status(STATUS.OK).json({message: 'Trainee ID, Trainer ID and Training Course ID are required',status:STATUS.BAD_REQUEST});
        }
        const newFeedback= new TrainerFeedback({
            feedback,
            ratings,
            traineeId:trainee,
            trainerId,
            trainingCourseId
        });
        await newFeedback.save();
        return res.status(STATUS.OK).json({message: 'Feedback submitted successfully', feedback: newFeedback,status:STATUS.CREATED});
    }catch(error){
        console.error('Error submitting feedback:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message: 'Internal server error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}