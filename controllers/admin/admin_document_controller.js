const Document=require('../../models/document_model');


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
