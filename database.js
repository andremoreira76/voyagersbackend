/*const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '192.168.255.201',
    user: 'voyagers',
    password: 'Octogno@1976*',
    database: 'voyagersv2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
*/
const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = pool;