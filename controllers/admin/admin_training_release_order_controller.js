const Training = require("../../models/training_program_model");
const httpStatus = require("../../utils/httpStatus");
const Enrollment = require("../../models/enrollment_model");
const ReleaseOrder = require('../../models/release_order_model');
const User = require('../../models/user_model');
const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const crypto = require('crypto');
const path = require('path');
exports.generateReleaseOrder = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const [training, enrollments] = await Promise.all([
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



exports.downloadReleaseOrder = async (req, res) => {
    let browser;
    try {
        const { trainingId } = req.params;

        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null;

        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 1,
        });
        if (authHeader) {
            await page.setExtraHTTPHeaders({ 'Authorization': authHeader });
        }
        // const domain = "http://localhost:5173";
        const domain = "https://staging2.egovmz.in";
        await page.goto(domain);
        if (token) {
            await page.evaluate((t) => {
                localStorage.setItem('token', t); // Match this key to what your app uses
            }, token);
        }
        const previewUrl = `${domain}/admin/training/${trainingId}/release-order/`;

        await page.goto(previewUrl, {
            waitUntil: "networkidle0",
            timeout: 60000
        });
        await page.waitForSelector('#release-order-document', { timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.addStyleTag({
            content: `
        /* Target common class names and tags for headers/sidebars */
        header, .header, #header, 
        nav, .nav, .navbar,
        aside, .sidebar, #sidebar,
        .fixed, .no-print, 
        [class*="sidebar"], [class*="header"] {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            visibility: hidden !important;
        }

        /* Reset the main content layout */
        body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
        }

        /* Ensure the document container takes the full width and removes offsets */
        #release-order-document {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            transform: none !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }
    `
        });
        await page.evaluate(() => {
            // Remove any padding-left or margin-left that layouts use for sidebars
            const main = document.querySelector('main');
            if (main) {
                main.style.margin = '0';
                main.style.padding = '0';
            }
        });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
        });

        await browser.close();
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Release_Order_${trainingId}.pdf"`,
        });

        return res.send(pdfBuffer);

    } catch (error) {
        if (browser) await browser.close();
        console.error("Puppeteer PDF Error:", error);
        res.status(500).json({ message: "Failed to generate report", error: error.message });
    }
};



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
    const SERVER_URL = 'https://staging2.egovmz.in';
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
            "Name": "Lalfakzuala",
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
            "SUrl": `${SERVER_URL}/admin-api/emSignerSuccessResponse/${trainingId}`,
            "FUrl": `${SERVER_URL}/admin-api/emSignerFailureResponse/${trainingId}`,
            "CUrl": `${SERVER_URL}/admin-api/emSignerResponse`,
            "ReferenceNumber": "ATI-" + Date.now(),
            "Enableuploadsignature": true,
            "Enablefontsignature": true,
            "EnableDrawSignature": true,
            "EnableeSignaturePad": false,
            "IsCompressed": false,
            "IsCosign": true,
            "Storetodb": false,
            "IsGSTN": false,
            "IsGSTN3B": false,
            "IsCustomized": true,
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
    // const SERVER_URL = 'https://staging2.egovmz.in';
    const SERVER_URL = 'http://localhost:5173';
    const { trainingId } = req.params;
    try {

        const releaseOrder = await ReleaseOrder.findOne({ training_program: trainingId });

        if (!releaseOrder) {
            return res.status(404).send("Original training record not found.");
        }
        const sessionKey = Buffer.from(releaseOrder.temp_session_key, 'base64');
        const encryptedBuffer = Buffer.from(req.body.Returnvalue, 'base64');
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

