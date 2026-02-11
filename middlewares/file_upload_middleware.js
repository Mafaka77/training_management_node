const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Images & PDF
        "image/jpeg", "image/png", "image/jpg", "application/pdf",
        
        // Word Documents (.doc and .docx)
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        
        // Excel Spreadsheets (.xls and .xlsx)
        "application/vnd.ms-excel", 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        
        // PowerPoint Presentations (.ppt and .pptx)
        "application/vnd.ms-powerpoint", 
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Passing a more descriptive error message
        cb(new Error("File type not supported. Please upload Images, PDFs, or MS Office documents."), false);
    }
};

// Multer configuration
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});

module.exports = upload;
