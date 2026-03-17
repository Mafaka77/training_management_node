const Training = require("../../models/training_program_model");
const httpStatus = require("../../utils/httpStatus");
const Enrollment = require("../../models/enrollment_model");
const puppeteer = require('puppeteer');
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
            return res.status(httpStatus.NOT_FOUND).json({
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
        const domain = "http://localhost:5173";
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