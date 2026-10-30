const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'classdb.it.mtu.edu',
  database: process.env.USERNAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD
});

connection.addListener('error', (err) => {
  console.log(err);
});

// ...database queries here

connection.end();