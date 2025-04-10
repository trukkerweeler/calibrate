// croncal.js
import dotenv from 'dotenv';
dotenv.config();

import db from './db.js';
import nodemailer from 'nodemailer';

async function shouldRun() {
    const [lastSentRow] = await db.query('SELECT LASTSENT_DATE FROM LASTSENT WHERE MODULE = ?', ['CALIBRATION']);
    const lastSentDate = lastSentRow?.LASTSENT_DATE;

    const now = new Date();
    if (!lastSentDate || now - new Date(lastSentDate) > 24 * 60 * 60 * 1000) {
        return true;
    }
    return false;
}

async function hasOverdue() {
    const [overdueRow] = await db.query(`SELECT COUNT(*) AS overdue_count FROM DEVICES WHERE NEXT_DATE < NOW() AND STATUS = 'A'`);
    return overdueRow?.overdue_count > 0;
}

async function runDailyEmailJob() {
    if (!(await shouldRun())) {
        console.log('Not time yet. Skipping...');
        return;
    }

    if (!(await hasOverdue())) {
        console.log('No overdue items. Skipping...');
        return;
    }

    const usersToEmail = [
        { email: process.env.EMAIL_USER1 },
    ];

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.QSMTP_PASS,
        },
    });

    const overdueDevices = await db.query(`
        SELECT DEVICE_ID, NAME, MAJOR_LOCATION, MINOR_LOCATION, NEXT_DATE 
        FROM DEVICES 
        WHERE NEXT_DATE < NOW() AND STATUS = 'A'
    `).then(devices => {
        if (devices.length > 0) {
            const tableRows = devices.map(device => `
                <tr>
                    <td>${device.DEVICE_ID}</td>
                    <td>${device.NAME}</td>
                    <td>${device.MAJOR_LOCATION}</td>
                    <td>${device.MINOR_LOCATION}</td>
                    <td>${new Date(device.NEXT_DATE).toLocaleDateString()}</td>
                </tr>
            `).join('');

            console.log('Generated HTML table for overdue devices.');
            return `
                <table border="1" style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr>
                            <th>Device ID</th>
                            <th>Name</th>
                            <th>Major Location</th>
                            <th>Minor Location</th>
                            <th>Next Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } else {
            console.log('No overdue devices found.');
            return '<p>No overdue devices found.</p>';
        }
    });

    for (const user of usersToEmail) {
        await transporter.sendMail({
            from: `"Calibration Team" <${process.env.EMAIL_USER}>`, 
            to: user.email,
            subject: 'Daily Calibration Notification',
            // text: 'Hello! This is your daily message.',
            html: `
                <p>Hello,</p>
                <p>This is your daily notification for overdue devices:</p>
                ${overdueDevices}
                <p>Best regards,<br>Calibration Team</p>
            `,
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
                
            }
        });
    }

    await db.query(`
        INSERT INTO LASTSENT (MODULE, LASTSENT_DATE) 
        VALUES (?, NOW()) 
        ON DUPLICATE KEY UPDATE LASTSENT_DATE = NOW()
    `, ['CALIBRATION']);
}

runDailyEmailJob().catch(console.error);
