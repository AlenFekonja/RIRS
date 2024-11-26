const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.DB_HOST)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT,   
});

/// just write a test here 
    db.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err.message);
        } else {
            console.log('Connected to MySQL database');
        }
    });

    afterAll((done) => {
        // Properly close the MySQL connection
        db.end((err) => {
            if (err) {
                console.error('Error closing the MySQL connection:', err);
                done(err);
            } else {
                console.log('MySQL connection closed');
                done();
            }
        });
    });

module.exports = db;