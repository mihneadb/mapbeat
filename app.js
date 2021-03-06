var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

var SECOND = 1000;
var MINUTE = 60 * SECOND;
var EXPIRE_DELTA = 10 * MINUTE;

/** Data store for mapbeats. Uses phone's id as a key,
 * beat data as value.
 */
var heartbeats = {};


/////////////////////// ROUTES

app.get('/', index);

app.get('/beats/', getBeats);

app.post('/beats/', postBeats);

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});


/////////////////////// HANDLERS

/**
 * Serves the main page. Magic redirect toward static path.
 */
function index (req, res) {
    res.redirect('/index.html');
}

/**
 * API method for getting all fresh beats.
 */
function getBeats (req, res) {
    clearOldBeats();
    res.send(JSON.stringify(heartbeats, null, 2));
}

/**
 * API method for registering a new beat.
 * POST body should be JSON and contain lat, lng, id.
 */
function postBeats (req, res) {
    var data = req.body;

    if (!validateData(data)) {
        res.status(400).send('Must send lat, lng, id');
        return;
    }

    var beat = {
        'lat': data.lat,
        'lng': data.lng,
        'ts': Date.now()
    }
    heartbeats[data.id] = beat;

    res.send(JSON.stringify(beat));
}

/////////////////////// HELPERS

/**
 * Checks that the passed object respects the mapbeat format.
 * @param {object} data - POST body of the request
 */
function validateData(data) {
    if (!data.lat || !data.lng || !data.id) {
        return false;
    }
    return true;
}

/**
 * Keeps the mapbeats storage up to date, clearing expired beats.
 */
function clearOldBeats() {
    Object.keys(heartbeats).forEach(function (id) {
        var beat = heartbeats[id];
        if (Date.now() - beat['ts'] >= EXPIRE_DELTA) {
            delete heartbeats[id];
        }
    });
}

