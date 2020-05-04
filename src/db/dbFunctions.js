const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://tdtcovdqovegae:dbcf60e41c7a89ea58e988a1c12c5d00f571cffa511c266022c4dbe0e7509109@ec2-54-221-214-183.compute-1.amazonaws.com:5432/d2m340flohpr2g?ssl=true';
const pool = new Pool({connectionString: connectionString});
const async = require('async');

/*********************PARTICIPANTS***************************** */
const getParticipants = (id, callback) => {
    const params = [id];
    const sql = 'SELECT * FROM  Participant WHERE bracket_id = $1';
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occurred while fetching the participants');
            return console.log(err);
        }
        callback(null, result.rows);
    });
}

const editParticipants = (slots, callback) => {
    async.each(slots, (participant, cb) => {
        var params = [participant.name, participant.id];
        const sql = 'UPDATE Participant SET Name = $1 WHERE id = $2';
        pool.query(sql, params, (err, result) => {
            if( err) {
                console.log('There was an error updating the participants');
                return console.log(err);
            }
            cb();
        });
    }, callback);
}

const addSlots = (slots, id, callback) => {
    async.each(slots, (name, cb) => {
        var params = [name.name, id];
        const sql = 'INSERT INTO Participant (name, bracket_id, is_eliminated) VALUES ($1, $2, false) RETURNING *';
        pool.query(sql, params, (err, result) => {
            if(err) {
                console.log('Error adding slots');
                return console.log(err);
            }
            cb();
        });
    }, callback);
}

const deleteSlotsThenAdd = (slots, id, callback) => {
    const params1 = [id];
    const sql1 = 'DELETE FROM Participant WHERE bracket_id = $1';
    pool.query(sql1, params1, (err, result1) => {
        if(err) {
            console.log('Error deleting participants');
            return console.log(err);
        }
    });
    async.each(slots, (name, cb) => {
        var params2 = [name.name, id];
        const sql2 = 'INSERT INTO Participant (name, bracket_id, is_eliminated) VALUES ($1, $2, false) RETURNING *';
        pool.query(sql2, params2, (err, result2) => {
            if(err) {
                console.log('Error adding slots');
                return console.log(err);
            }
            cb();
        });
    }, callback);
}

/*************************BRACKET************************* */
const getBracketInfo = (id, callback) => {
    params = [id];
    const sql = 'SELECT * FROM Bracket WHERE id = $1';
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occured with the Bracked DB');
            return console.log(err);
        }
        callback(null, result.rows);
    })
}

const buildBracket = (tourneyName, slots, callback) => {
    var weeks = getNumWeeks(slots);
    var params = [tourneyName, slots, weeks];
    const sql = 'INSERT INTO Bracket (bracketname, num_slots, num_weeks) VALUES($1, $2, $3) RETURNING *;';
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occurred while inserting into bracket');
            return console.log(err);
        }
        for(i = 0; i < weeks; i++) {
            addWeeks(i + 1, result.rows[0].id);
        }
        callback(err, result);
    });
}

const editBracketInfo = (id, name, slots, callback) => {
    var weeks = getNumWeeks(slots);
    params = [id, name, slots, weeks];
    const sql = 'UPDATE Bracket SET bracketname = $2, num_slots = $3, num_weeks = $4 WHERE id = $1 RETURNING *';
    pool.query(sql, params, (err, result) => {
        if( err) {
            console.log('There was an error updating the bracket information');
            return console.log(err);
        }
        deleteWeeks(id);
        for(i = 0; i < weeks; i++) {
            addWeeks(i + 1, result.rows[0].id);
        }
        callback();
    });
}

const getNumWeeks = (slots) => {
    var effectiveSlots = Math.pow(2, Math.ceil(Math.log(slots)/Math.log(2)));
    var weeks = getPowerOfTwo(effectiveSlots);
    return weeks;
} 

const getPowerOfTwo = (num) => {
    var divisions = 0;
    while(num > 2) {
        num /= 2;
        divisions ++;
    }
    if(num > 1) {
        divisions++;
    }
    return divisions;
}

/*************************Round************************* */
const addRound = (id, participants, week, callback) => {
    var params = [id, week];
    var valuesString = ' VALUES ';
     for(i = participants.length; i > 0; i -= 2) {
         var participant1;
         var participant2;
         if(!participants[i]) {
             participant1 = null;
         } else {
             participant1 = participants[i].id;
         }
         if(!participants[i - 1]) {
             participant2 = null;
         } else {
             participant2 = participants[i - 1].id;
         }
         valuesString  += '($1, $2, ' + participant1 + ', ' + participant2 + '), ';
    }
    newString = valuesString.substr(0, valuesString.length - 2);
    newString += ';';
    const sql = 'INSERT INTO Round (bracket_id, week_num, participant_1, participant_2)' + newString;
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occurred while inserting into round');
            return console.log(err);
        }
        callback(err, result);
    });
}

const getRound = (id, callback) => {
    params = [id];
    const sql = 'SELECT * FROM Round WHERE bracket_id = $1';
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occured while fetching round information');
            return console.log(err);
        }
        callback(null, result.rows);
    });
}

/*************************Week************************* */
const addWeeks = (week, id) => {
    var params = [week, id];
    const sql = 'INSERT INTO Week (week, bracket_id) VALUES($1, $2)';
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occured while adding weeks');
            return console.log(err);
        }
    });
}

const deleteWeeks = (id) => {
    var params = [id];
    const sql = 'DELETE FROM Week WHERE bracket_id = $1';
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log('An error has occured while adding weeks');
            return console.log(err);
        }
    });
}
module.exports = {
    getParticipants,
    editParticipants,
    addSlots,
    getBracketInfo,
    buildBracket,
    editBracketInfo,
    deleteSlotsThenAdd,
    addRound,
    getRound,
    addWeeks,
    deleteWeeks
}