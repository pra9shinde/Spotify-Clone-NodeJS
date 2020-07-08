const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'slotify',
    password: ''
});

module.exports = pool.promise();
