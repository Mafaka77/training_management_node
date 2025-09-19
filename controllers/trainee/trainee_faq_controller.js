const Faq=require('../../models/faq_model');
const STATUS=require('../../utils/httpStatus')
exports.getFaq = async (req, res) => {
    try {
        // Read query params (default: offset=0, limit=10)
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Count total FAQs for pagination info
        const totalFaqs = await Faq.countDocuments();

        // Fetch with pagination
        const faq = await Faq.find()
            .skip(offset)
            .limit(limit);

        if (!faq || faq.length === 0) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: 'No Faq found'
            });
        }

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            total: totalFaqs,
            offset,
            limit,
            count: faq.length,
            faq
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};
