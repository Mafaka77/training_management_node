const User = require('../../models/user_model');
const Enrollment = require('../../models/enrollment_model');
const TrainingProgram = require('../../models/training_program_model');
const Category = require('../../models/training_category_model')
const STATUS = require('../../utils/httpStatus');
const mongoose = require('mongoose');
const EnrolledOrder = require('../../models/enrolled_order_model');
const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

exports.getAllEnrollment = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            sortOrder = "desc",
            status = ""
        } = req.query;

        page = Math.max(1, parseInt(page));
        limit = parseInt(limit);
        console.log(req.query);
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'trainingprograms',
                    localField: 'training_program',
                    foreignField: '_id',
                    as: 'training_program'
                }
            },
            { $unwind: { path: '$training_program', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    ...(status && status !== 'All' ? { status: status } : {}),
                    ...(search ? {
                        $or: [
                            { "user.full_name": { $regex: search, $options: "i" } },
                            { "training_program.t_name": { $regex: search, $options: "i" } }
                        ]
                    } : {})
                }
            }
        ];
        const countResult = await mongoose.model('Enrollment').aggregate([
            ...pipeline,
            { $count: "total" }
        ]);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        pipeline.push(
            { $sort: { createdAt: sortOrder === "desc" ? -1 : 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        );

        const enrollments = await mongoose.model('Enrollment').aggregate(pipeline);

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Error fetching paginated enrollments"
        });
    }
};
exports.getEnrollmentById = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate({
                path: 'user',
                select: 'full_name email department designation mobile',
                populate: {
                    path: 'group',
                    select: 'group_name'
                }
            })
            .populate("training_program");

        if (!enrollment) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Enrollment not found"
            });
        }
        const userHistory = await Enrollment.find({
            user: new mongoose.Types.ObjectId(enrollment.user._id),
            status: 'Approved'
        }).populate("training_program");
        res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollment,
            userHistory
        });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
}
exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        // Destructure 'status' directly from req.body
        const { status } = req.body;
        console.log(status);
        // 1. Validation: Ensure status exists and is valid
        const validStatuses = ["Pending", "Approved", "Rejected", "Waitlisted"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: `Invalid status. Please choose: ${validStatuses.join(", ")}`
            });
        }

        // 2. Fetch Enrollment with User and Training info
        const enrollment = await Enrollment.findById(enrollmentId).populate('training_program');
        if (!enrollment) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Enrollment not found"
            });
        }

        // 3. Capacity Logic (Only if the admin is trying to Approve)
        if (status === "Approved") {
            const training = enrollment.training_program;

            // Count currently approved users, excluding THIS user 
            // (in case they were already approved, we don't want to double count)
            const approvedCount = await Enrollment.countDocuments({
                training_program: training._id,
                status: 'Approved',
                _id: { $ne: enrollmentId }
            });

            if (approvedCount >= training.t_capacity) {
                console.log('a khat');
                return res.status(STATUS.OK).json({
                    status: STATUS.BAD_REQUEST,
                    message: `Training Capacity full (${training.t_capacity}).`
                });
            }
        }
        // 4. Save Status
        enrollment.status = status;
        await enrollment.save();
        // 6. Final Response
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: `Enrollment marked as ${status} successfully`,
        });

    } catch (error) {
        console.error("Enrollment Update Error:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Something went wrong on the server."
        });
    }
};

exports.generateSelectedTraineesOrder = async (req, res) => {
    try {
        const { trainingId } = req.params;
        console.log(trainingId);
        const training = await TrainingProgram.findById(trainingId).populate('t_director');
        if (!training) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Training not found"
            });
        }

        let enrollments = await Enrollment.find({
            training_program: trainingId,
            status: 'Approved'
        }).populate('user')
        if (enrollments.length === 1) {
            const singleRecord = enrollments[0];
            const fakeEnrollments = [];

            for (let i = 1; i <= 50; i++) {
                // Deep copy the object so we can modify it safely
                const copy = JSON.parse(JSON.stringify(singleRecord));

                // Make the IDs unique so Vue's v-for :key doesn't crash
                copy._id = singleRecord._id + '_mock_' + i;

                // Modify the user data slightly so you can tell them apart in the UI
                if (copy.user) {
                    copy.user._id = singleRecord.user._id + '_mock_' + i;
                    copy.user.full_name = `${singleRecord.user.full_name} (Clone ${i})`;
                    copy.user.email = `clone${i}@example.com`;
                }

                fakeEnrollments.push(copy);
            }

            // Replace the real array with your massive fake array
            enrollments = fakeEnrollments;
        }
        console.log(enrollments.length)
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollments,
            training,
            message: 'Data fetched successfully'

        });
    } catch (error) {
        console.error("Enrollment Update Error:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
}
exports.storeSelectedListOrder = async (req, res) => {
    const { trainingId, filename, htmlContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(STATUS.OK).json({ status: STATUS.BAD_REQUEST, message: "Invalid Training ID format" });
    }

    try {
        // 1. Wrap the user's HTML in a standard document shell
        // Orders are ALWAYS A4 Portrait, and we MUST allow the height to expand infinitely for multiple pages
        const fullHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    /* Force A4 Portrait and remove margins so your Vue padding applies perfectly */
                    @page { size: A4 portrait; margin: 0; }
                    
                    body { 
                        margin: 0; 
                        padding: 0; 
                        width: 210mm; 
                        /* Removed height and overflow: hidden so all pages render! */
                        box-sizing: border-box; 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                    }

                    /* Ensure Puppeteer respects the Vue page breaks */
                    .page-break { page-break-after: always !important; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        // 2. Setup File Path
        const dir = path.join(process.cwd(), 'uploads', 'enrollment');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = path.join(dir, filename || `Order_${Date.now()}.pdf`);

        // 3. Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new', // or true depending on your puppeteer version
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Load the HTML and wait for Tailwind CSS to completely finish compiling via CDN
        await page.setContent(fullHtmlContent, { waitUntil: 'networkidle0' });

        // Print exactly what was on the user's screen
        await page.pdf({
            path: filePath,
            format: 'A4',
            landscape: false, // Always portrait for official orders
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
            // 🚨 REMOVED pageRanges: '1' so Puppeteer prints ALL pages (Order + Annexures)
        });

        await browser.close();

        // 4. Save to MongoDB
        const enrolledOrder = new EnrolledOrder({
            training_program: trainingId,
            file_name: filename,
            enrolled_order_url: `/uploads/enrollment/${filename}`,
        });

        await enrolledOrder.save();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Enrolled List generated and saved successfully!",
            data: enrolledOrder,
        });

    } catch (ex) {
        console.error("Puppeteer PDF Generation Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
};
exports.prepareForESign = async (req, res) => {
    const { trainingId, id } = req.params;
    const PUBLIC_KEY_PATH = path.join(__dirname, '../../cert', 'cert.cer')
    // const SERVER_URL = 'https://parchment-unabashed-urging.ngrok-free.dev';
    const SERVER_URL = 'https://atimz.mizoram.gov.in';
    try {
        const enrolledOrder = await EnrolledOrder.findById(id);
        if (!enrolledOrder) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Enrolled Order not found",
            });
        }
        const user = await User.findById(req.user.user.id);
        const sessionKey = crypto.randomBytes(32);
        const fileName = enrolledOrder.file_name;
        const pdfFilePath = enrolledOrder.enrolled_order_url;
        const localFilePath = path.join(__dirname, '../../', pdfFilePath)
        const fileBase64 = readFileSync(localFilePath, 'base64');
        const incomingData = {
            "Name": user.full_name,
            "FileType": "PDF",
            "AuthToken": "c49046e1-c3de-4a1b-8024-679f0debadaa",
            "File": fileBase64,
            "SignatureMode": "3",
            "SelectPage": "1",
            "SignaturePosition": "Bottom-Right",
            "PageNumber": "1",
            "PreviewRequired": true,
            "PagelevelCoordinates": "",
            "CustomizeCoordinates": "400,50,550,150",
            "SUrl": `${SERVER_URL}/admin-api/training/${trainingId}/enrollment/order/${id}/success`,
            "FUrl": `${SERVER_URL}/admin-api/emSignerFailureResponse/${trainingId}`,
            "CUrl": `${SERVER_URL}/admin-api/emSignerResponse`,
            "ReferenceNumber": "ATI-" + Date.now(),
            "Enableuploadsignature": true,
            "Enablefontsignature": true,
            "EnableDrawSignature": true,
            "EnableeSignaturePad": false,
            "IsCompressed": false,
            "IsCosign": false,
            "Storetodb": false,
            "IsGSTN": false,
            "IsGSTN3B": false,
            "IsCustomized": false,
            "AuthenticationMode": 1,
            "EnableInitials": false
        };
        await enrolledOrder.updateOne({
            $set: {
                temp_session_key: sessionKey.toString('base64'),
                reference_number: incomingData.ReferenceNumber
            }
        })
        const jsonString = JSON.stringify(incomingData);
        const parameter2 = encryptAES(jsonString, sessionKey);
        const hash = crypto.createHash('sha256').update(jsonString).digest();
        const parameter3 = encryptAES(hash, sessionKey);

        const publicKey = readFileSync(PUBLIC_KEY_PATH, 'utf8');
        const parameter1 = crypto.publicEncrypt(
            {
                key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING
            },
            sessionKey
        ).toString("base64");

        return res.status(STATUS.OK).json({ status: STATUS.OK, parameter1, parameter2, parameter3 })

    } catch (ex) {
        const enrolledOrder = await EnrolledOrder.findByIdAndDelete(id);
        const filePath = path.join(__dirname, "../../", enrolledOrder.enrolled_order_url);
        try {
            await require('fs').promises.unlink(filePath);
        } catch (err) {
            console.error("File deletion error (disk):", err.message);
        }
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: ex.message })
    }
}
exports.enrolledOrderSuccessResponse = async (req, res) => {
    const SERVER_URL = 'https://atimz.mizoram.gov.in';
    // const SERVER_URL = 'http://localhost:5173';
    const { trainingId, id } = req.params;
    try {

        const enrolledOrder = await EnrolledOrder.findOne({ _id: id });

        if (!enrolledOrder) {
            return res.status(404).send("Enrolled Order not found.");
        }
        const sessionKey = Buffer.from(enrolledOrder.temp_session_key, 'base64');
        const encryptedBuffer = Buffer.from(req.body.Returnvalue, 'base64');
        const decryptedPdfBuffer = decryptBinaryAES(encryptedBuffer, sessionKey);

        const newFileName = `signed_${enrolledOrder.file_name}`;
        const filePath = path.join(__dirname, "../../", enrolledOrder.enrolled_order_url);
        await require('fs').promises.unlink(filePath);
        const savePath = path.join(__dirname, '../../uploads/enrollment', newFileName);
        await require('fs').promises.writeFile(savePath, decryptedPdfBuffer);
        await EnrolledOrder.updateOne(
            { _id: id },
            {
                $set: {
                    file_name: newFileName,
                    is_signed: true,
                    enrolled_order_url: `/uploads/enrollment/${newFileName}`,
                }
            }
        );
        res.redirect(`${SERVER_URL}/admin/training/${trainingId}/signature-success`);

    } catch (error) {
        console.error("Signature processing failed:", error);
        res.redirect(`${SERVER_URL}/admin/training/${trainingId}/signature-failure`);
    }
}
function encryptAES(data, key) {
    const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function decryptBinaryAES(encryptedBuffer, key) {
    const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
    decipher.setAutoPadding(true);
    const chunk1 = decipher.update(encryptedBuffer);
    const chunk2 = decipher.final();
    return Buffer.concat([chunk1, chunk2]);
}
exports.fetchEnrolledOrdersByTraining = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const enrolledOrders = await EnrolledOrder.find({ training_program: trainingId });
        if (!enrolledOrders) {
            return res.status(STATUS.NOT_FOUND).json({ status: STATUS.NOT_FOUND, message: "No enrolled orders found" });
        }
        return res.status(STATUS.OK).json({ status: STATUS.OK, data: enrolledOrders });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: error.message });
    }
}

exports.deleteEnrolledOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await EnrolledOrder.findByIdAndDelete(id);
        if (!result) {
            return res.status(STATUS.NOT_FOUND).json({ status: STATUS.NOT_FOUND, message: "No enrolled order found" });
        }
        const filePath = path.join(__dirname, "../../", result.enrolled_order_url);
        try {
            await require('fs').promises.unlink(filePath);
        } catch (err) {
            console.error("File deletion error (disk):", err.message);
        }
        return res.status(STATUS.OK).json({ status: STATUS.OK, message: "Enrolled order deleted successfully", data: result });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: error.message });
    }
}
