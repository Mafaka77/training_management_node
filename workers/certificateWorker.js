const { Worker } = require('bullmq');
const { connection } = require('../queues/certificateQueue');
const connectDB = require('../config/db');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const Certificate = require('../models/certificate_model');
const TrainingProgram = require('../models/training_program_model');
const User = require('../models/user_model');
const Role = require('../models/role_model');
require('../models/training_category_model');
const { generateCertificateHtml } = require('../utils/certificateTemplate');

// Ensure DB is connected for standalone worker execution
require('dotenv').config();
connectDB();

const processCertificate = async (job) => {
    const { traineeId, trainingId, certificateId, options } = job.data;

    try {
        console.log(`Processing certificate for Trainee ${traineeId}, Program ${trainingId}`);

        // Fetch required data
        const directorRole = await Role.findOne({ name: 'Director' }).lean();
        const [program, trainee, director] = await Promise.all([
            TrainingProgram.findById(trainingId).populate('t_category').populate('t_director').lean(),
            User.findById(traineeId).lean(),
            User.findOne({ roles: directorRole._id }).lean()
        ]);

        if (!program || !trainee) throw new Error("Program or Trainee not found");

        // Generate QR Code
        // const verifyUrl = `https://atimz.mizoram.gov.in/verify-certificate/${certificateId}`;
        const verifyUrl = `http://192.168.0.221:5001/verify-certificate/${certificateId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });

        // Add templateStyle based on category
        options.templateStyle = program.t_category?.name || "Standard";

        // Generate HTML
        const htmlContent = generateCertificateHtml(trainee, program, director, qrCodeDataUrl, options);

        // Setup File Path
        const filename = `cert_${certificateId}_${Date.now()}.pdf`;
        const dir = path.join(process.cwd(), 'uploads', 'certificate');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const filePath = path.join(dir, filename);

        // Generate PDF
        const isPortrait = options.templateStyle === 'Mandatory';
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: filePath,
            format: 'A4',
            landscape: !isPortrait,
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            pageRanges: '1'
        });
        await browser.close();

        // Save to Database
        await Certificate.findByIdAndUpdate(certificateId, {
            file_name: filename,
            certificate_url: `/uploads/certificate/${filename}`,
            status: 'completed',
            is_signed: true
        });

        // Update Mandatory Completion status
        if (options.templateStyle === 'Mandatory') {
            await User.findByIdAndUpdate(traineeId, { mandatory_completion: true });
        }

        console.log(`Certificate ${filename} generated successfully.`);
        return { success: true, certificateId, filename };

    } catch (error) {
        console.error(`Failed to generate certificate for job ${job.id}:`, error);

        await Certificate.findByIdAndUpdate(certificateId, {
            status: 'failed',
            error_message: error.message
        });

        throw error;
    }
};

const certificateWorker = new Worker('certificate-generation', processCertificate, { connection });

certificateWorker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
});

certificateWorker.on('failed', (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = certificateWorker;
