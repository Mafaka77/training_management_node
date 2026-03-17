import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: '"Training Portal" <onboarding@resend.dev>',
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error("Email Error:", error);
        return { success: false, error };
    }
};