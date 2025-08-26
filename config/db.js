const mongoose=require('mongoose');
const trainingJobs = require("../jobs/training_jobs");
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDB Connected Successfully");
        trainingJobs();
    }catch(error){
        console.error("MongoDB Connection Failed:",error);
        process.exit(1);
    }
}
module.exports = connectDB;