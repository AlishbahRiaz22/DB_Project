const mysql = require('mysql2');
require('dotenv').config();

// Creating the pool 
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

exports.pool = pool;
