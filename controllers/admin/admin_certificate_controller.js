
const TrainingProgram = require('../../models/training_program_model');
const User = require('../../models/user_model');
const mongoose = require("mongoose");
const STATUS = require('../../utils/httpStatus')
const Role = require('../../models/role_model')
const Certificate = require('../../models/certificate_model')
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { readFileSync } = require('fs');
const crypto = require('crypto');
const Attendance = require('../../models/attendance_model');
const Session = require('../../models/training_course_model');
const Enrollment = require('../../models/enrollment_model');
const QRCode = require('qrcode');
const { certificateQueue } = require('../../queues/certificateQueue');
exports.getTraineeCertificateDetails = async (req, res) => {
    const { traineeId } = req.params;
    const { trainingId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(traineeId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(STATUS.OK).json({
            status: STATUS.BAD_REQUEST,
            message: "Invalid Trainee ID or Training ID format"
        });
    }
    const directorRole = await Role.findOne({ name: 'Director' }).lean();
    try {
        const [program, trainee, director] = await Promise.all([
            TrainingProgram.findById(trainingId).populate('t_category').populate('t_director').lean(),
            User.findById(traineeId).lean(),
            User.findOne({ roles: directorRole._id }).lean()
        ]);

        if (!program) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Program not found"
            });
        }

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: {
                traineeId,
                trainee,
                program,
                director
            }
        });

    } catch (ex) {
        console.error("Trainee Attendance Details Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
}

exports.storeCertificate = async (req, res) => {
    const { traineeId, trainingId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(STATUS.OK).json({
            status: STATUS.BAD_REQUEST,
            message: "Certificate file is required"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(traineeId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(STATUS.OK).json({
            status: STATUS.BAD_REQUEST,
            message: "Invalid Trainee ID or Training ID format"
        });
    }

    try {
        const certificate = new Certificate({
            user: traineeId,
            training_program: trainingId,
            certificate_url: `/uploads/certificate/${req.file.filename}`,
        });

        await certificate.save();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Certificate stored successfully",
            data: certificate
        });
    } catch (ex) {
        console.error("Store Certificate Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
}
exports.generateAndStoreCertificate = async (req, res) => {
    const { traineeId, trainingId, filename, templateStyle, htmlContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(traineeId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(400).json({ success: false, message: "Invalid Trainee or Training ID format" });
    }

    try {
        const certificateId = new mongoose.Types.ObjectId();
        const verifyUrl = `http://192.168.0.221:5001/verify-certificate/${certificateId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });

        const dummyQrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATCSURBVO3BSY4jSRAEQbUA//9lnT76KYBEOquXMZH4C1VLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLDlWLPryUhJ+ksikJk8pNEm5UpiQ8oTIl4SepvHGoWnSoWnSoWvRhmcqmJGxKwqTyhMpNEiaVTSqbkrDpULXoULXoULXow5cl4QmVJ5Jwo3KThEmlSsKkMiVhUrlJwo3KE0l4QuWbDlWLDlWLDlWLPvzjknCjcqNyozIlYVK5UfmXHKoWHaoWHaoWffjHqLyRhCdUbpLwf3KoWnSoWnSoWvThy1R+pyRMKpuScKNyk4RJ5QmVP8mhatGhatGhatGHZUn4myRhUpmSMKlMSZhUpiRMKm8k4U92qFp0qFp0qFr04SWVP5nKE0mYVKYkTCo3Km+o/E0OVYsOVYsOVYs+vJSESWVKwiaVSeUmCZPKjcqUhEllSsKNypSESeUmCZtUvulQtehQtehQtejDH07lJgmTyqTyhsoTKk8kYVJ5Q+WJJEwqbxyqFh2qFh2qFsVf+EFJuFGZkjCpTEm4UZmScKNyk4RJZUrCpHKThE0qv9OhatGhatGhatGHH6Zyk4RJ5QmVJ1RukjCpTEmYVKYkTCqTypSEJ1SmJEwqUxImlU2HqkWHqkWHqkUfliVhUrlJwqQyJWFSmVRukvCGypSESWVKwiaVN5IwqXzToWrRoWrRoWrRh5eSMKlMSZhUnlD5SUm4UZmS8EQSnkjCEypPJGFSeeNQtehQtehQtSj+wgtJuFF5IwlvqDyRhE0qbyRhk8o3HaoWHaoWHaoWfXhJZUrClIQblRuVJ5Jwk4RJ5UZlSsKkcpOEG5UpCTcqbyRhUtl0qFp0qFp0qFr04ctUpiQ8kYQblU0qUxImlZskTCo3SZhU3kjCjco3HaoWHaoWHaoWfXgpCZPKjcqUhBuV30nlJgk3SXgiCW+oTEm4ScKk8sahatGhatGhatGHL0vCpHKjMiVhUpmSMKlMSZhU3kjCpHKThEllSsKkMiVhUpmS8IbKpkPVokPVokPVog9fpjIl4SYJk8obKjdJmFSmJEwqT6hMSXhCZUrCEypTEiaVTYeqRYeqRYeqRR9+M5UpCVMSblSmJEwqNyo3KlMSnlB5IgmbknCThEnljUPVokPVokPVovgLf7EkTCpvJOFGZUrCEypTEiaVJ5KwSeWNQ9WiQ9WiQ9WiDy8l4SepTCo3SbhReSIJT6hMSXgiCZPKGyrfdKhadKhadKha9GGZyqYk3CRhUplU3lCZknCjMiXhDZUnVJ5IwqTyxqFq0aFq0aFq0YcvS8ITKm8kYVKZknCjMiXhRmVKwo3KlIQpCZuScKOy6VC16FC16FC16MM/RuUJlRuVmyRsUrlJwqQyJeGJJEwqbxyqFh2qFh2qFn34xyThiSS8oTIlYVJ5IglPJOENlU2HqkWHqkWHqkUfvkzlm1RukjCpbErCpHKThJ+kMiXhmw5Viw5Viw5Viz4sS8JPSsIbSZhUpiQ8kYRJ5UbljSRMKlMSJpVvOlQtOlQtOlQtir9QteRQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQteg/z0g9GjRvuIcAAAAASUVORK5CYII=';
        const updatedHtmlContent = htmlContent.replace(dummyQrCodeUrl, qrCodeDataUrl);

        const isPortrait = templateStyle === 'Mandatory';
        const widthFormat = isPortrait ? '210mm' : '297mm';
        const heightFormat = isPortrait ? '297mm' : '210mm';

        // 1. Wrap the user's edited HTML in a standard document shell
        const fullHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Satisfy&family=Great+Vibes&family=Playfair+Display&family=Montserrat&display=swap" rel="stylesheet">
                <style>
                    /* Prevent blank pages and force exact dimensions */
                    @page { size: ${isPortrait ? 'A4 portrait' : 'A4 landscape'}; margin: 0; }
                    body { 
                        margin: 0; 
                        padding: 0; 
                        width: ${widthFormat}; 
                        height: ${heightFormat}; 
                        overflow: hidden; 
                        box-sizing: border-box; 
                    }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                </style>
            </head>
            <body>
                ${updatedHtmlContent}
            </body>
            </html>
        `;

        // 2. Setup File Path
        const dir = path.join(process.cwd(), 'uploads', 'certificate');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const generatedFilename = filename || `cert_${Date.now()}.pdf`;
        const filePath = path.join(dir, generatedFilename);

        // 3. Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Load the HTML and wait for images/fonts to finish loading
        await page.setContent(fullHtmlContent, { waitUntil: 'networkidle0' });

        // Print exactly what was on the user's screen
        await page.pdf({
            path: filePath,
            format: 'A4',
            landscape: !isPortrait,
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            pageRanges: '1' // Force 1 page only
        });

        await browser.close();

        // 4. Save to MongoDB
        const certificate = new Certificate({
            _id: certificateId,
            user: traineeId,
            training_program: trainingId,
            file_name: generatedFilename,
            certificate_url: `/uploads/certificate/${generatedFilename}`,
            is_signed: true
        });

        await certificate.save();

        const training = await TrainingProgram.findById(trainingId).populate('t_category');
        if (training.t_category?.name === 'Mandatory') {
            const user = await User.findById(traineeId).exec();
            user.mandatory_completion = true;
            await user.save();
        }

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Certificate generated and saved successfully!",
            data: certificate
        });

    } catch (ex) {
        console.error("Puppeteer PDF Generation Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
};


exports.fetchCertificates = async (req, res) => {
    const { trainingId } = req.params;

    // 1. Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // 2. Map frontend sort keys to database fields
    // 'full_name' belongs to the populated user document, so we map it to our joined field
    const sortKey = req.query.sortKey === 'full_name' ? 'userDetails.full_name' : req.query.sortKey || 'createdAt';

    try {
        // 3. Use an Aggregation Pipeline to allow sorting on populated/joined fields
        const pipeline = [
            // Match the specific training program
            { $match: { training_program: new mongoose.Types.ObjectId(trainingId) } },

            // Join the 'users' collection (Ensure 'users' matches your actual MongoDB collection name!)
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },

            // Deconstruct the array created by $lookup
            { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },

            // Sort the documents
            {
                $sort: {
                    is_signed: 1, // Keep unsigned certificates at the top
                    [sortKey]: sortOrder // Then apply the user's chosen sort
                }
            },

            // Execute pagination and count in parallel
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                }
            }
        ];

        const result = await Certificate.aggregate(pipeline);

        // 4. Format the data back to match what your Vue frontend expects
        const certificatesData = result[0].data.map(doc => {
            doc.user = doc.userDetails;
            delete doc.userDetails;
            return doc;
        });

        const totalItems = result[0].metadata[0] ? result[0].metadata[0].total : 0;

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: certificatesData,
            total: totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit)
        });

    } catch (ex) {
        console.error("Fetch Certificates Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
}
exports.prepareForESign = async (req, res) => {
    const PUBLIC_KEY_PATH = path.join(__dirname, '../../cert', 'cert.cer')
    // const SERVER_URL = 'https://parchment-unabashed-urging.ngrok-free.dev';
    const SERVER_URL = 'https://atimz.mizoram.gov.in';
    let signCoordinate = "400 300 120 300";
    try {
        const { id } = req.params;
        console.log(id);
        const certificate = await Certificate.findById(id).populate('user').populate('training_program');
        const training = await TrainingProgram.findById(certificate.training_program).populate('t_category');
        if (training.t_category.name == 'Mandatory') {
            signCoordinate = "120,100,320,180";
        } else {
            signCoordinate = "120,100,320,180";
        }
        console.log(signCoordinate);
        const user = await User.findById(req.user.user.id);
        const sessionKey = crypto.randomBytes(32);
        const pdfFilePath = certificate.certificate_url;
        const localFilePath = path.join(__dirname, '../../', pdfFilePath)
        const fileBase64 = readFileSync(localFilePath, 'base64');
        const incomingData = {
            "Name": user.full_name,
            "FileType": "PDF",
            //LIVE
            "AuthToken": "b3eac112-fa5c-48ba-9ebe-19aea7b6e48c",
            //STAGING
            // "AuthToken": "c49046e1-c3de-4a1b-8024-679f0debadaa",
            "File": fileBase64,
            "SignatureMode": "2",
            "SelectPage": "1",
            "SignaturePosition": "Bottom-Left",
            "PageNumber": "1",
            "PreviewRequired": true,
            "PagelevelCoordinates": "",
            "CustomizeCoordinates": signCoordinate,
            "SUrl": `${SERVER_URL}/admin-api/certificate/${certificate._id}/training/${certificate.training_program._id}/success`,
            "FUrl": `${SERVER_URL}/admin-api/emSignerFailureResponse/${certificate.training_program._id}`,
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
        await certificate.updateOne({
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
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: ex.message })
    }
}

exports.certificateSuccessResponse = async (req, res) => {
    const SERVER_URL = 'https://atimz.mizoram.gov.in';
    // const SERVER_URL = 'http://localhost:5173';
    const { trainingId, certificateId } = req.params;
    try {

        const certificate = await Certificate.findOne({ _id: certificateId });

        if (!certificate) {
            return res.status(404).send("Certificate not found.");
        }
        const sessionKey = Buffer.from(certificate.temp_session_key, 'base64');
        const encryptedBuffer = Buffer.from(req.body.Returnvalue, 'base64');
        const decryptedPdfBuffer = decryptBinaryAES(encryptedBuffer, sessionKey);

        const newFileName = `signed_${certificate.file_name}`;
        const filePath = path.join(__dirname, "../../uploads/certificate", certificate.file_name);
        await require('fs').promises.unlink(filePath);
        const savePath = path.join(__dirname, '../../uploads/certificate', newFileName);
        await require('fs').promises.writeFile(savePath, decryptedPdfBuffer);
        await Certificate.updateOne(
            { _id: certificateId },
            {
                $set: {
                    file_name: newFileName,
                    is_signed: true,
                    certificate_url: `/uploads/certificate/${newFileName}`,
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
exports.deleteCertificate = async (req, res) => {
    const { certificateId } = req.params;
    try {
        const certificate = await Certificate.findByIdAndDelete(certificateId);
        if (!certificate) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Certificate not found"
            });
        }
        const filePath = path.join(__dirname, "../../", certificate.certificate_url);
        try {
            await require('fs').promises.unlink(filePath);
        } catch (err) {
            console.error("File deletion error (disk):", err.message);
        }
        res.status(STATUS.OK).json({ status: STATUS.OK, message: "Certificate deleted successfully." });
    } catch (ex) {
        console.error("Delete Certificate Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: ex.message });
    }
}

exports.batchGenerateCertificates = async (req, res) => {
    const { trainingId } = req.params;
    const { options } = req.body;

    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(STATUS.BAD_REQUEST).json({ status: STATUS.BAD_REQUEST, message: "Invalid Training ID format" });
    }

    try {
        const sessions = await Session.find({ t_program: trainingId }).lean();
        const totalSessions = sessions.length;

        if (totalSessions === 0) {
            return res.status(STATUS.BAD_REQUEST).json({ status: STATUS.BAD_REQUEST, message: "No sessions found for this training." });
        }

        const enrollments = await Enrollment.find({ training_program: trainingId }).lean();
        const traineeIds = enrollments.map(e => e.user);

        const attendanceRecords = await Attendance.find({
            trainingId: trainingId,
            status: 'Present'
        }).lean();

        const presentCountMap = {};
        attendanceRecords.forEach(record => {
            const uid = record.user.toString();
            presentCountMap[uid] = (presentCountMap[uid] || 0) + 1;
        });

        const eligibleTrainees = [];
        for (const tid of traineeIds) {
            const present = presentCountMap[tid.toString()] || 0;
            const percentage = (present / totalSessions) * 100;
            if (percentage >= 75) {
                eligibleTrainees.push(tid);
            }
        }

        if (eligibleTrainees.length === 0) {
            return res.status(STATUS.OK).json({ status: STATUS.OK, message: "No trainees have >= 75% attendance." });
        }

        let addedJobs = 0;
        for (const traineeId of eligibleTrainees) {
            const existing = await Certificate.findOne({ user: traineeId, training_program: trainingId });
            if (!existing) {
                const certificate = new Certificate({
                    user: traineeId,
                    training_program: trainingId,
                    status: 'processing'
                });
                await certificate.save();

                await certificateQueue.add('generate', {
                    traineeId,
                    trainingId,
                    certificateId: certificate._id,
                    options: options || {}
                });
                addedJobs++;
            } else if (existing.status === 'failed') {
                existing.status = 'processing';
                await existing.save();
                await certificateQueue.add('generate', {
                    traineeId,
                    trainingId,
                    certificateId: existing._id,
                    options: options || {}
                });
                addedJobs++;
            }
        }

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: `Batch generation started. Added ${addedJobs} new jobs for eligible trainees.`
        });

    } catch (ex) {
        console.error("Batch Certificate Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: ex.message });
    }
};