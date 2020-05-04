const express = require('express');
const router = new express.Router();
const async = require('async');
const db = require('../db/dbFunctions');

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to TourneyMan'
    });
});

/*********************CREATE BRACKET***************************** */
router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create'
    });
});

router.post('/addSlots', (req, res) => {
    const name = req.body.tourneyName;
    const slots = req.body.slots;
    var slotsArray = [];
    for(i = 0; i < slots; i++) {
        slotsArray[i] = i + 1;
    }
    // const elimination = req.body.elimination;
    // const order = req.body.order;
    // const conference = req.body.conference;
    db.buildBracket(name, slots, (error, result /*, slotsArray*/) => {
        res.render('addSlots', {
            slots: slotsArray,
            names: slots,
            tourneyId: result.rows[0].id
        })
    });
})

router.post('/verifyBracket', (req, res) => {
    const id = req.body.tourneyId;
    const slots = req.body.slots;
    async.series([
        db.getBracketInfo.bind(db, id),
        db.addSlots.bind(db, slots, id)
    ], function (error, result) {
        if(error) {
            res.status(500).send('Error: ' + error);
            return;
        }
        res.render('verifyBracket', {
            title: 'Verify your bracket',
            tourneyInfo: result[0][0],
            tourneyId: id,
            slots: slots
        })
    });
});

router.get('/editBracketInfo', (req, res) => {
    const id = req.query.tourneyId;
    db.getBracketInfo(id, (err, result) => {
        res.render('editInfo', {
            tourneyInfo: result[0],
            tourneyId: id
        });
    })
});

router.post('/editInfo', (req, res) => {
    const id = req.body.tourneyId;
    const name = req.body.tourneyName;
    const slots = req.body.slots;
    var slotsArray = [];
    async.series([
        db.editBracketInfo.bind(db, id, name, slots),
        db.getParticipants.bind(db, id),
    ], function (error, result) {
        if(error) {
            res.status(500).send('Error: ' + error);
            return;
        }
        for(i = 0; i < slots; i++) {
            slotsArray[i] = result[1][i];
        }
        res.render('editParticipants', {
            slots: slotsArray,
            tourneyId: id
        })
    });
});

router.get('/editParticipants', (req, res) => {
    const id = req.query.tourneyId;
    db.getParticipants(id, (err, result) => {
        res.render('editParticipants', {
            tourneyId: id,
            slots: result
        });
    });
});

router.post('/verifyParticipants', (req, res) => {
    const id = req.body.tourneyId;  
    async.series([
        db.deleteSlotsThenAdd.bind(db, req.body.slots, id),
        db.getParticipants.bind(db, id),
        db.getBracketInfo.bind(db, id)
    ], function (error, result) {
        if(error) {
            res.status(500).send('Error: ' + error);
            return;
        }
        res.render('verifyBracket', {
            title: 'Verify your bracket',
            tourneyInfo: result[2][0],
            tourneyId: id,
            slots: result[1]
        })
    });
});

router.post('/home', (req, res) => {
    const id = req.body.tourneyId;
    const week = 1;
    db.getParticipants(id, (error1, result1) => {
        db.addRound(id, result1, week, (error2, result2) => {
            res.render('home', {
                title: 'Welcome to TourneyMan'
            });
        });
    });
});

/*********************UPDATE***************************** */
router.get('/update', (req, res) => {
    res.render('update', {
        title: 'Update a Bracket'
    });
});

router.get('/share', (req, res) => {
    res.render('share', {
        title: 'Share'
    });
});

router.get('/view', (req, res) => {
    db.getBracketInfo((error, bracket) => {
        res.render('view', {
            title: 'View your bracket'
        })
    })
});

module.exports = router;