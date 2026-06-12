const Document = require('../../models/document_model')
const Status = require('../../utils/httpStatus')
exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 })
        if (!documents) return res.status(Status.OK).json({ message: 'No documents found', status: Status.BAD_REQUEST })
        return res.status(Status.OK).json({ message: 'Documents fetched successfully', status: Status.OK, documents })
    } catch (ex) {
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ message: ex.message, status: Status.INTERNAL_SERVER_ERROR })
    }
}
