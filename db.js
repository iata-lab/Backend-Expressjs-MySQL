import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Change as needed
  password: '', // Change as needed
  database: 'express_mysql_lab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
