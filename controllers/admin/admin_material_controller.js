const Material=require('../../models/materials_model');
const TrainingProgram=require('../../models/training_program_model')
const STATUS=require('../../utils/httpStatus')
exports.submitMaterial=async(req,res)=>{
     try {
            
            const {title,programId}=req.body;
            const userId=req.user.user.id;
            if (!req.files || req.files.length === 0) {
                return res.status(STATUS.OK).json({ message: "No files uploaded",status:STATUS.BAD_REQUEST });
            }
    
            const program = await TrainingProgram.findById(programId);
            if (!program) {
                return res.status(STATUS.OK).json({ message: "Program not found",status:STATUS.NOT_FOUND});
            }
    
            // Save each file to Materials collection
            const savedMaterials = await Promise.all(
                req.files.map(async (file) => {
                    const material = new Material({
                        title:title,
                        file_name: file.filename,
                        file_size:file.size,
                        file_url: `/uploads/${file.filename}`, // public url or local path
                        program: programId,
                        uploadedBy:userId,
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

}
exports.getMaterials = async (req, res) => {
    try {
        const { programId } = req.params;

        // 1. Validate Input
        if (!programId) {
            return res.status(STATUS.OK).json({ 
                status: STATUS.BAD_REQUEST, 
                message: "Program ID is required" 
            });
        }
        const materials = await Material.find({ program: programId })
            .populate('uploadedBy','full_name')
            .sort({ createdAt: -1 });

        return res.status(STATUS.OK).json({

            status: STATUS.OK,
            materials: materials || []
        });

    } catch (ex) {
        console.error("Error fetching materials:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while retrieving materials",
            error: ex.message
        });
    }

};
exports.deleteMaterial= async (req, res) => {
    const { id } = req.params;
    try {
        const material = await Material.findById(id);
        if (!material) {
            return res.status(STATUS.OK).json({ message: "Material not found" ,status:STATUS.NOT_FOUND});
        }

        // Remove the file from the server
        if (material.fileUrl) {
            const filePath = path.join(__dirname, '../../', material.fileUrl);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.warn('File not found or already deleted:', filePath);
                }
            });
        }

        await Material.findByIdAndDelete(id);
        res.status(STATUS.OK).json({ message: "Material deleted successfully" ,status:STATUS.OK });
    } catch (error) {
        console.error("Error deleting material:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" ,status:STATUS.INTERNAL_SERVER_ERROR });
    }
};