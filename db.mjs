// db.mjs

import mysql from 'mysql2/promise';

export async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
  });
  const [results] = await connection.execute(sql, params);
  await connection.end(); // Close the connection after each query
  return results;
}

export default {
  query
};
