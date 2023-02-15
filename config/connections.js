const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
);

module.exports = db;


// ************* Maybe use this? *************
// const mysql = require('mysql2/promise');
// require('dotenv').config();


// function db() {
//     return mysql.createConnection(
//         {
//             host: 'localhost',
//             user: process.env.DB_USER,
//             password: process.env.DB_PASS,
//             database: process.env.DB_NAME
//         },
//     console.log("Now connected to " + process.env.DB_NAME + " database.\n")
// )};

// module.exports = { db };