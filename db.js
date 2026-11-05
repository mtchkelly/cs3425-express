const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'classdb.it.mtu.edu',
  database: process.env.USERNAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD
});

connection.addListener('error', (error) => {
  console.error('Database connection error:', error);
});

module.exports = connection;