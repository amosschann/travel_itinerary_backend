const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
});


module.exports = pool.promise();
