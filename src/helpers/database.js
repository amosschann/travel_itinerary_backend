const mysql = require('mysql2');
require('dotenv').config();

// Database connection

const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_PASSWORD,
  database: 'travelitineraries'
});

database.connect((err => {
  if (err) throw err;
  console.log('MySQL Connected');
}));

module.exports = database;
