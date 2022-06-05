var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile('splash.html', {root: './public'});
});

/* Pressing the 'JOIN' button, returns this page */
router.get('/game', function(req, res) {
    res.sendFile('game.html', {root: './public'});
});

/* This is the URL for the splash screen */
router.get('/splash', function(req, res) {
    res.sendFile('splash.html', {root: './public'});
});

module.exports = router;
