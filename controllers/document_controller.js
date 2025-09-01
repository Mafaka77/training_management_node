const Document = require("../models/document_model");
const STATUS=require("../utils/httpStatus");
// GET /documents
exports.getDocuments = async (req, res) => {
    try {
        const userRole = req.user.user.roles[0]; // first role
        const search = req.query.search || "";

        let { page, offset, limit = 10 } = req.query;

        limit = parseInt(limit);

        // Build filter
        const filter = {
            accessRoles: { $in: [userRole] },
            title: { $regex: search, $options: "i" }
        };

        let documents, total;

        // 🔹 Case 1: Web pagination (page + limit)
        if (page) {
            page = parseInt(page);
            const skip = (page - 1) * limit;

            documents = await Document.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            total = await Document.countDocuments(filter);

            return res.status(STATUS.OK).json({
                status: STATUS.OK,
                documents,
                pagination: {
                    type: "page",
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        // 🔹 Case 2: Flutter pagination (offset + limit)
        if (offset) {
            offset = parseInt(offset);

            documents = await Document.find(filter)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit);

            total = await Document.countDocuments(filter);

            return res.status(STATUS.OK).json({
                status: STATUS.OK,
                documents,
                pagination: {
                    type: "offset",
                    total,
                    offset,
                    limit,
                    hasMore: offset + documents.length < total
                }
            });
        }

        // Default (return first page if nothing passed)
        documents = await Document.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit);

        total = await Document.countDocuments(filter);

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            documents,
            pagination: {
                type: "default",
                total,
                offset: 0,
                limit,
                hasMore: limit < total
            }
        });

    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
};

