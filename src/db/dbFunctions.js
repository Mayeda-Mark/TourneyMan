const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://tdtcovdqovegae:dbcf60e41c7a89ea58e988a1c12c5d00f571cffa511c266022c4dbe0e7509109@ec2-54-221-214-183.compute-1.amazonaws.com:5432/d2m340flohpr2g?ssl=true';
const pool = new Pool({connectionString: connectionString});

const getParticipants = (callback) => {
    const sql = 'SELECT * FROM  Participant';
    pool.query(sql, (err, result) => {
        if(err) {
            console.log('An error has occurred while fetching the participants');
            return console.log(err);
        }
        callback(null, result.rows);
    });
}

const getBuilder = (callback) => {
    const sql = 'SELECT round_num FROM  Builder';
    pool.query(sql, (err, result) => {
        if(err) {
            console.log('An error has occurred while fetching the builder information');
            return console.log(err);
        }
        callback(null, result.rows);
    });
}

module.exports = {
    getParticipants,
    getBuilder
}