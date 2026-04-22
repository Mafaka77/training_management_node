const ReleaseOrder = require('../../models/release_order_model');
const httpStatus = require('../../utils/httpStatus');
exports.getCertificateAndReleaseOrder = async (req, res) => {
    try {
        const { trainingId } = req.query;
        console.log(trainingId)
        const releaseOrder = await ReleaseOrder.findOne({ training_program: trainingId, is_signed: true });
        const certificate = {
            _id: 'asdasdasdasd',
            file_name: 'Certificate.pdf',
            certificate_url: '/uploads/materials-1771397187308-135065337.pdf',
            is_signed: true,
            createdAt: '2026-04-13T16:20:22.463+00:00'
        }
        return res.status(httpStatus.OK).json({ releaseOrder: releaseOrder, certificate: certificate, status: httpStatus.OK })
    } catch (ex) {
        console.log(ex);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: ex.message, status: httpStatus.INTERNAL_SERVER_ERROR })
    }
}
