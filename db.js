import mysql from 'mysql2/promise';

// check for missing environment variables
const missingConfiguration = ['USERNAME', 'PASSWORD']
  .filter((name) => !process.env[name]);

if (missingConfiguration.length > 0) {
  throw new Error(
    `Missing database configuration: ${missingConfiguration.join(', ')}. ` +
    'Copy .env.example to .env and provide your classdb credentials.'
  );
}

// create and export reusable database connection
let pool;
try {
  pool = mysql.createPool({
    host: 'classdb.it.mtu.edu',
    database: process.env.USERNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    connectionLimit: 3,
    waitForConnections: true,
  });
} catch (err) {
  console.error('Unable to connect to the database.');
  console.error('Check USERNAME and PASSWORD in .env, then try again.\n');
  console.error(`Database error: ${err.message}`);
  process.exitCode = 1;
  throw new Error('Database startup failed.');
}

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

pool.on('connection', (conn) => {
  conn.on('error', (err) => {
    console.error('Database connection error:', err);
  });
});

export default pool;
