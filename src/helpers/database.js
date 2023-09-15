const mysql = require('mysql2');
require('dotenv').config();

// Database connection

const database = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.DATABASE_PASSWORD,
  database: process.database.database
});

database.connect((err => {
  if (err) throw err;
  console.log('MySQL Connected');
}));

module.exports = database;
