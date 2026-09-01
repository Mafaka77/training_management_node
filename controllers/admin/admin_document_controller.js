const Document = require('../../models/document_model');
const User = require('../../models/user_model');
const Role = require('../../models/role_model');
const Notification = require('../../models/notification_model');
const { sendPushToMultipleUsers } = require('../../services/push_service');
const fs = require('fs');
const path = require('path');
const STATUS = require('../../utils/httpStatus');

exports.submitDocument = async (req, res) => {
    try {
        const { title, description, accessRoles } = req.body;

        // Validate file upload
        if (!req.files || req.files.length === 0) {
            return res.status(STATUS.OK).json({ message: "No documents uploaded", status: STATUS.NOT_FOUND });
        }

        const parsedRoles = accessRoles
            ? (typeof accessRoles === 'string' ? JSON.parse(accessRoles) : accessRoles)
            : ["Admin", "Trainee", "Trainer", "Course Director"];

        // Store multiple documents
        for (const file of req.files) {
            const doc = new Document({
                title: title || file.originalname, // fallback to filename
                description: description || "",
                fileUrl: `/uploads/${file.filename}`, // or S3 / GCP URL if using cloud
                fileType: file.mimetype,
                uploadedBy: req.user?.user?.id || req.user?.id || req.user?._id, // from authenticate middleware
                accessRoles: parsedRoles
            });

            await doc.save();
        }

        const docTitle = title || (req.files[0]?.originalname || "New Document");
        const docCount = req.files.length;
        const notifTitle = "New Document Available";
        const notifBody = docCount > 1 
            ? `${docCount} new documents uploaded: ${docTitle}`
            : `A new document "${docTitle}" has been uploaded.`;

        // 1. Save in-app notification
        try {
            const adminNotification = new Notification({
                sender_id: req.user?.user?.id || req.user?._id,
                type: "Broadcast",
                title: notifTitle,
                message: notifBody,
                target_url: "/admin/master/documents",
                is_read: false
            });
            await adminNotification.save();
        } catch (dbNotifErr) {
            console.error("❌ [Notification] Error saving document notification in DB:", dbNotifErr.message);
        }

        // 2. Dispatch FCM Push Notifications to users with matching access roles
        (async () => {
            try {
                const roleDocs = await Role.find({ name: { $in: parsedRoles } }).distinct('_id');
                const targetUsers = await User.find({
                    roles: { $in: roleDocs },
                    is_active: { $ne: false }
                }).distinct('_id');

                if (targetUsers.length > 0) {
                    const recipientIds = targetUsers.map(id => id.toString());
                    console.log(`📣 [FCM] Dispatching document push to ${recipientIds.length} user(s) for "${docTitle}"`);

                    await sendPushToMultipleUsers(recipientIds, {
                        title: notifTitle,
                        body: notifBody,
                        url: "/admin/master/documents",
                        data: {
                            type: "Document",
                            title: notifTitle,
                            url: "/admin/master/documents"
                        }
                    });
                }
            } catch (fcmErr) {
                console.error("❌ [FCM] Error notifying users of new document:", fcmErr.message || fcmErr);
            }
        })();

        res.status(STATUS.OK).json({
            message: "Documents uploaded successfully",
            status: STATUS.CREATED
        });

    } catch (error) {
        console.error("Error uploading documents:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error", status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
exports.deleteDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id);
        if (!document) {
            return res.status(STATUS.OK).json({ message: "Document not found", status: STATUS.NOT_FOUND });
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
        res.status(STATUS.OK).json({ message: "Document deleted successfully", status: STATUS.OK });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error", status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(STATUS.OK).json({ documents, status: STATUS.OK });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error", status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
exports.getDocumentById = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id);
        if (!document) {
            return res.status(STATUS.OK).json({ message: "Document not found", status: STATUS.NOT_FOUND });
        }
        res.status(STATUS.OK).json({ document, status: STATUS.OK });
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error", status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
