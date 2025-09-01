const Department=require('../../models/department_model');
const STATUS=require('../../utils/httpStatus');
exports.createDepartment=async (req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name){
            return res.status(STATUS.OK).json({message:"Department name is required",status:STATUS.BAD_REQUEST});
        }
        const existingDepartment=await Department.findOne({name});
        if(existingDepartment){
            return res.status(STATUS.OK).json({message:"Department with this name already exists",status:STATUS.CONFLICT});
        }
        const department=new Department({name,description});
        await department.save();
        return res.status(STATUS.OK).json({message:"Department created successfully",department,status:STATUS.CREATED});
    }catch(error){
        console.error("Error creating department:",error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});
    }
}
exports.getAllDepartments = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // Build filter for search (case-insensitive)
        const filter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        // Pagination
        const skip = (page - 1) * limit;

        // Fetch departments
        const departments = await Department.find(filter)
            .sort({ createdAt: -1 }) // optional sorting
            .skip(skip)
            .limit(limit);

        // Count total for pagination
        const total = await Department.countDocuments(filter);

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            departments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching departments:", error);
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal server error" });
    }
};

exports.deleteDepartment=async (req,res)=>{
    try{
        const {departmentId}=req.params;
        const department=await Department.findById(departmentId);
        if(!department){
            return res.status(STATUS.OK).json({message:"Department not found",status:STATUS.NOT_FOUND});
        }
        await Department.findByIdAndDelete(departmentId);
        return res.status(STATUS.OK).json({message:"Department deleted successfully",status:STATUS.OK});
    }catch(error){
        console.error("Error deleting department:",error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});
    }
}