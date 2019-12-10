const express = require('express');
const router = new express.Router();
const async = require('async');
const db = require('../db/dbFunctions');

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to TourneyMan'
    });
});

router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create'
    });
});

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
    db.getParticipants((error, participants) => {
        db.getBuilder((error, builder) => {
            var names = new Array;
            for (let i = 0; i < participants.length; i++) {
                names[i] = participants[i].name;
                
            }
            console.log(names);
            res.render('view', {
                participant: names,
                round: builder,
                title: 'View'
            });
        });
    });
});

module.exports = router;