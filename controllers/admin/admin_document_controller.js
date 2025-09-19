const Document=require('../../models/document_model');
const fs = require('fs');
const path = require('path');
const STATUS=require('../../utils/httpStatus');

exports.submitDocument = async (req, res) => {
    try {
        const { title, description, accessRoles } = req.body;

        // Validate file upload
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No documents uploaded" });
        }

        // Store multiple documents
        const uploadedDocs = [];

        for (const file of req.files) {
            const doc = new Document({
                title: title || file.originalname, // fallback to filename
                description: description || "",
                fileUrl: `/uploads/${file.filename}`, // or S3 / GCP URL if using cloud
                fileType: file.mimetype,
                uploadedBy: req.user.user.id, // from authenticate middleware
                accessRoles: accessRoles ? JSON.parse(accessRoles) : ["Admin","Trainee", "Trainer"] // default access if not provided
            });

            await doc.save();
            uploadedDocs.push(doc);
        }

        res.status(201).json({
            message: "Documents uploaded successfully",
            documents: uploadedDocs
        });

    } catch (error) {
        console.error("Error uploading documents:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id);
        if (!document) {
            return res.status(STATUS.OK).json({ message: "Document not found" ,status:STATUS.NOT_FOUND});
        }

        // Remove the file from the server
        if (document.fileUrl) {
            const filePath = path.join(__dirname, '../../', document.fileUrl);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.warn('File not found or already deleted:', filePath);
                }
            });
        }

        await Document.findByIdAndDelete(id);
        res.status(STATUS.OK).json({ message: "Document deleted successfully" ,status:STATUS.OK });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" ,status:STATUS.INTERNAL_SERVER_ERROR });
    }
};
