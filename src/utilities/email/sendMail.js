import nodemailer from 'nodemailer';
import { emailTemplate } from './email.template.js';

export const sendMail = async (email) => {
try {
    const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'waleedhammadmohammed@gmail.com',
        pass: 'mcdq qkpz cndv novd'
    }
    });


    const info = await transporter.sendMail({
    from: '"NTI " <waleedhammadmohammed@gmail.com>',
    to: email,
    subject: 'Verify your email ',
    html:emailTemplate(email)
    });

    console.log(" Email sent:", info.messageId);
    return true;

} catch (error) {
    console.error("Failed to send email:", error.message);
    return false;
}
};
