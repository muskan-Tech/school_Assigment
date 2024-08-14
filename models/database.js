const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12725662',
    password: 'IcLXs1gLU6',
    database: 'sql12725662',
    port:3306

});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;