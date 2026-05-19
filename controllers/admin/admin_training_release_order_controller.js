const Training = require("../../models/training_program_model");
const httpStatus = require("../../utils/httpStatus");
const Enrollment = require("../../models/enrollment_model");
const ReleaseOrder = require('../../models/release_order_model');
const User = require('../../models/user_model');
const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
exports.generateReleaseOrder = async (req, res) => {
    try {
        const { trainingId } = req.params;
        let [training, enrollments] = await Promise.all([
            Training.findById(trainingId).populate('t_director').lean(),
            Enrollment.find({
                training_program: trainingId,
                status: "Approved"
            })
                .populate('user', 'full_name designation department')
                .lean()
        ]);
        if (!training) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Training program not found',
                status: httpStatus.NOT_FOUND
            });
        }

        if (!enrollments || enrollments.length === 0) {
            return res.status(httpStatus.OK).json({
                message: 'No approved participants found for this training',
                status: httpStatus.NOT_FOUND
            });
        }
        if (enrollments.length === 1) {
            const singleRecord = enrollments[0];
            const fakeEnrollments = [];

            for (let i = 1; i <= 120; i++) {
                // Deep copy the object so we can modify it safely
                const copy = JSON.parse(JSON.stringify(singleRecord));

                // Make the IDs unique so Vue's v-for :key doesn't crash
                copy._id = singleRecord._id + '_mock_' + i;

                // Modify the user data slightly so you can tell them apart in the UI
                if (copy.user) {
                    copy.user._id = singleRecord.user._id + '_mock_' + i;
                    copy.user.full_name = `${singleRecord.user.full_name} (Clones ${i})`;
                    copy.user.email = `clone${i}@example.com`;
                }

                fakeEnrollments.push(copy);
            }

            // Replace the real array with your massive fake array
            enrollments = fakeEnrollments;
        }
        return res.status(httpStatus.OK).json({
            message: 'Participants retrieved successfully',
            status: httpStatus.OK,
            users: enrollments,
            training: training
        });

    } catch (error) {
        console.error("Error generating release order data:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Server error while fetching release data',
            status: httpStatus.INTERNAL_SERVER_ERROR
        });
    }
};


exports.generateAndStoreReleaseOrder = async (req, res) => {
    const { trainingId, filename, htmlContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(httpStatus.OK).json({ status: httpStatus.BAD_REQUEST, message: "Invalid Training ID format" });
    }

    try {
        // 1. Wrap the Vue HTML in a standard document shell with Tailwind
        const fullHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @page { size: A4 portrait; margin: 0; }
                    body { 
                        margin: 0; 
                        padding: 0; 
                        width: 210mm; 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important;
                        font-family: 'Times New Roman', Times, serif;
                        background-color: white;
                    }
                    /* Ensure the Annexure gets pushed to the second page */
                    section { page-break-after: always; }
                    section:last-child { page-break-after: auto; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        // 2. Setup File Path
        const dir = path.join(__dirname, '../../uploads'); // Adjust to your root uploads folder
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const finalFilename = filename || `Release_Order_${Date.now()}.pdf`;
        const filePath = path.join(dir, finalFilename);

        // 3. Launch Puppeteer (With Production-Safe Flags)
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--single-process'
            ]
        });

        const page = await browser.newPage();

        // Load the HTML and wait for Tailwind to compile
        await page.setContent(fullHtmlContent, { waitUntil: 'networkidle0' });

        // Generate the PDF
        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await browser.close();

        // 4. Save/Update MongoDB
        // Using findOneAndUpdate with upsert:true creates it if it doesn't exist, or updates if it does
        const releaseOrder = await ReleaseOrder.findOneAndUpdate(
            { training_program: trainingId },
            {
                $set: {
                    file_name: finalFilename,
                    release_order_url: `/uploads/${finalFilename}`,
                    is_signed: false // Reset signature status if they regenerate it
                }
            },
            { new: true, upsert: true }
        );

        return res.status(httpStatus.OK).json({
            status: httpStatus.CREATED,
            message: "Release Order generated and saved successfully!",
            data: releaseOrder
        });

    } catch (ex) {
        console.error("Puppeteer PDF Generation Error:", ex);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occurred while generating the Release Order on the server."
        });
    }
}

exports.saveReleaseOrderToServer = async (req, res) => {
    try {
        // Extract ID from the URL params
        const { trainingId } = req.params;

        // Multer attaches the uploaded file to req.file
        const file = req.file;

        if (!file) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: "No PDF document received. Please try again."
            });
        }

        // 1. Define the DB path (Multer already saved the physical file)
        const subFolder = "release_orders";
        const dbPath = `/uploads/${file.filename}`;

        // 2. CHECK FOR EXISTING ORDER (To prevent duplicates & save disk space)
        const existingOrder = await ReleaseOrder.findOne({ training_program: trainingId });

        if (existingOrder) {
            // Delete the old PDF file from the server disk
            const oldFilePath = path.join(__dirname, "../../", existingOrder.release_order_url);
            try {
                await fs.unlink(oldFilePath);
            } catch (err) {
                console.warn("Old file was already missing from disk, continuing...");
            }
            // Delete the old record from DB
            await ReleaseOrder.findOneAndDelete({ training_program: trainingId });
        }

        // 3. UPDATE TRAINING MODEL
        await Training.findByIdAndUpdate(trainingId, {
            release_order: true,
        });

        // 4. CREATE NEW RELEASE ORDER RECORD
        const newOrder = await ReleaseOrder.create({
            file_name: file.filename,
            training_program: trainingId,
            release_order_url: dbPath,
        });

        return res.status(httpStatus.OK).json({
            status: httpStatus.CREATED,
            message: "Release Order generated and saved successfully.",
            path: dbPath,
            data: newOrder
        });

    } catch (error) {
        console.error("PDF Upload Controller Error:", error);

        // If the database fails, try to delete the file Multer just uploaded so it doesn't leave junk
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkErr) {
                // Ignore cleanup errors
            }
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to process the uploaded PDF",
            error: error.message
        });
    }
};

exports.getReleaseOrder = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const releaseOrder = await ReleaseOrder.findOne({ training_program: trainingId });
        return res.status(httpStatus.OK).json({ status: httpStatus.OK, releaseOrder: releaseOrder });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
    }
};


exports.deleteReleaseOrder = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const order = await ReleaseOrder.findOne({ training_program: trainingId });
        if (!order) {
            return res.status(httpStatus.OK).json({
                message: "Release order not found",
                status: httpStatus.NOT_FOUND
            });
        }
        const filePath = path.join(__dirname, "../../", order.release_order_url);
        try {
            await require('fs').promises.unlink(filePath);
        } catch (err) {
            console.error("File deletion error (disk):", err.message);
        }
        await ReleaseOrder.findOneAndDelete({ training_program: trainingId });
        await Training.findByIdAndUpdate(trainingId, {
            release_order: false,
        });

        return res.status(httpStatus.OK).json({
            message: "Release order and file deleted successfully",
            status: httpStatus.OK
        });

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Failed to delete release order",
            error: error.message
        });
    }
};

exports.prepareForESign = async (req, res) => {
    const PUBLIC_KEY_PATH = path.join(__dirname, '../../cert', 'cert.cer')
    // const SERVER_URL = 'https://parchment-unabashed-urging.ngrok-free.dev';
    const SERVER_URL = 'https://atimz.mizoram.gov.in';
    try {
        const { trainingId } = req.params;
        const releaseOrder = await ReleaseOrder.findOne({ training_program: trainingId });
        const user = await User.findById(req.user.user.id);
        const sessionKey = crypto.randomBytes(32);
        const fileName = releaseOrder.file_name;
        const pdfFilePath = releaseOrder.release_order_url;
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
            "SUrl": `${SERVER_URL}/admin-api/emSignerSuccessResponse/${trainingId}`,
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
        await releaseOrder.updateOne({
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

        return res.status(httpStatus.OK).json({ status: httpStatus.OK, parameter1, parameter2, parameter3 })

    } catch (ex) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: ex.message })
    }
}
exports.emSignerSuccessResponse = async (req, res) => {
    const SERVER_URL = 'https://atimz.mizoram.gov.in';
    // const SERVER_URL = 'http://localhost:5173';
    const { trainingId } = req.params;
    try {

        const releaseOrder = await ReleaseOrder.findOne({ training_program: trainingId });

        if (!releaseOrder) {
            return res.status(404).send("Original training record not found.");
        }
        const sessionKey = Buffer.from(releaseOrder.temp_session_key, 'base64');
        const encryptedBuffer = Buffer.from(req.body.Returnvalue, 'base64');
        console.log(encryptedBuffer, sessionKey);
        const decryptedPdfBuffer = decryptBinaryAES(encryptedBuffer, sessionKey);

        const newFileName = `signed_${releaseOrder.file_name}`;
        const filePath = path.join(__dirname, "../../uploads", releaseOrder.file_name);
        await require('fs').promises.unlink(filePath);
        const savePath = path.join(__dirname, '../../uploads', newFileName);
        await require('fs').promises.writeFile(savePath, decryptedPdfBuffer);
        await ReleaseOrder.updateOne(
            { training_program: trainingId },
            {
                $set: {
                    is_signed: true,
                    file_name: newFileName,
                    release_order_url: `/uploads/${newFileName}`
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

