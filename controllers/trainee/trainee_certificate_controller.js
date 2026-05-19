const ReleaseOrder = require('../../models/release_order_model');
const httpStatus = require('../../utils/httpStatus');
const Certificate = require('../../models/certificate_model')
exports.getCertificateAndReleaseOrder = async (req, res) => {
    try {
        const { trainingId } = req.query;
        const userId = req.user.user._id;
        const releaseOrder = await ReleaseOrder.findOne({ training_program: trainingId, is_signed: true });
        const certificate = await Certificate.findOne({ training_program: trainingId, user: userId, is_signed: true });
        return res.status(httpStatus.OK).json({ releaseOrder: releaseOrder, certificate: certificate, status: httpStatus.OK })
    } catch (ex) {
        console.log(ex);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: ex.message, status: httpStatus.INTERNAL_SERVER_ERROR })
    }
}
