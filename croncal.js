// ===================================================
console.log("This is croncal.js file");


// // dailyEmailJob.js
// import db from './db.js';         // your database logic
// import nodemailer from 'nodemailer';

// async function shouldRun() {
//   const [lastRunRow] = await db.query('SELECT last_run FROM scheduler_log WHERE task = ?', ['daily_email']);
//   const lastRun = lastRunRow?.last_run;

//   const now = new Date();
//   if (!lastRun || now - new Date(lastRun) > 24 * 60 * 60 * 1000) {
//     return true;
//   }
//   return false;
// }

// async function runDailyEmailJob() {
//   if (!(await shouldRun())) {
//     console.log('Not time yet. Skipping...');
//     return;
//   }

//   const usersToEmail = await db.query('SELECT * FROM users WHERE notify = 1');

//   const transporter = nodemailer.createTransport({ /* your SMTP config */ });

//   for (const user of usersToEmail) {
//     await transporter.sendMail({
//       to: user.email,
//       subject: 'Daily Notification',
//       text: 'Hello! This is your daily message.',
//     });
//   }

//   await db.query('UPDATE scheduler_log SET last_run = NOW() WHERE task = ?', ['daily_email']);
//   console.log('Emails sent and last_run updated!');
// }

// runDailyEmailJob().catch(console.error);


// // db.js
// import mysql from 'mysql2/promise';

// // Create a connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'your_mysql_user',
//   password: 'your_password',
//   database: 'your_database_name',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Export a helper to query easily
// export async function query(sql, params) {
//   const [results] = await pool.execute(sql, params);
//   return results;
// }

// export default {
//   query
// };


// import db from './db.js';

// const users = await db.query('SELECT * FROM users WHERE active = ?', [1]);

// console.log(users); // results are just plain JS objects
