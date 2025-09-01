const Faq=require('../../models/faq_model');
const STATUS=require('../../utils/httpStatus');
exports.submitFaq=async(req,res)=>{
    try{
        const {question,answer}=req.body;
        if(!question || !answer){
            return res.status(STATUS.OK).json({message:'Question and Answer are required',status:STATUS.BAD_REQUEST});
        }
        const faq=new Faq({question,answer});
        await faq.save();
        return res.status(STATUS.OK).json({message:'FAQ created successfully',status:STATUS.CREATED});
    }catch(error){
        console.error('Error in submitFaq:',error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Internal Server Error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

exports.getAllFaq=async(req,res)=>{
    try{
        const faqs=await Faq.find().sort({createdAt:-1});
        return res.status(STATUS.OK).json({faqs,status:STATUS.OK});
    }catch(error){
        console.error('Error in getAllFaq:',error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Internal Server Error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

exports.getFaqById=async(req,res)=>{
    try{
        const {faqId}=req.params;
        const faq=await Faq.findById(faqId);
        if(!faq){
            return res.status(STATUS.OK).json({message:'FAQ not found',status:STATUS.NOT_FOUND});
        }
        return res.status(STATUS.OK).json({faq,status:STATUS.OK});
    }catch(error){
        console.error('Error in getFaqById:',error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Internal Server Error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.updateFaq=async(req,res)=>{
    try{
        const {faqId}=req.params;
        const {question,answer}=req.body;
        const faq=await Faq.findById(faqId);
        if(!faq){
            return res.status(STATUS.OK).json({message:'FAQ not found',status:STATUS.NOT_FOUND});
        }
        if(question) faq.question=question;
        if(answer) faq.answer=answer;
        await faq.save();
        return res.status(STATUS.OK).json({message:'FAQ updated successfully',status:STATUS.OK});
    }catch(error){
        console.error('Error in updateFaq:',error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Internal Server Error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.deleteFaq=async(req,res)=>{
    try{
        const {faqId}=req.params;
        const faq=await Faq.findById(faqId);
        if(!faq){
            return res.status(STATUS.OK).json({message:'FAQ not found',status:STATUS.NOT_FOUND});
        }
        await faq.deleteOne();
        return res.status(STATUS.OK).json({message:'FAQ deleted successfully',status:STATUS.OK});
    }catch(error){
        console.error('Error in deleteFaq:',error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Internal Server Error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

















