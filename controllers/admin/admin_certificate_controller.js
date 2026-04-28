
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
                ${htmlContent}
            </body>
            </html>
        `;

        // 2. Setup File Path
        const dir = path.join(process.cwd(), 'uploads', 'certificate');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = path.join(dir, filename || `cert_${Date.now()}.pdf`);

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
            user: traineeId,
            training_program: trainingId,
            file_name: filename,
            certificate_url: `/uploads/certificate/${filename}`,
        });

        await certificate.save();

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
    try {
        const certificates = await Certificate.find({ training_program: trainingId })
            .populate('user')
            .sort({ is_signed: 1 })
            .lean();
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: certificates
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
    try {
        const { id } = req.params;
        console.log(id);
        const certificate = await Certificate.findById(id).populate('user').populate('training_program');
        // console.log(certificate);

        const user = await User.findById(req.user.user.id);
        console.log(user);
        const sessionKey = crypto.randomBytes(32);
        const pdfFilePath = certificate.certificate_url;
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
            "CustomizeCoordinates": "",
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
                    is_signed: true,
                    certificate_url: `/uploads/certificate/${newFileName}`
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