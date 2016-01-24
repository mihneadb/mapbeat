var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

var SECOND = 1000;
var MINUTE = 60 * SECOND;
var EXPIRE_DELTA = 10 * MINUTE;

var heartbeats = {};


/////////////////////// ROUTES

app.get('/', function (req, res) {
    res.redirect('/index.html');
});

app.get('/beats/', function (req, res) {
    clearOldBeats();
    res.send(JSON.stringify(heartbeats, null, 2));
});

app.post('/beats/', function(req, res) {
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
});

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});


/////////////////////// HELPERS

function validateData(data) {
    if (!data.lat || !data.lng || !data.id) {
        return false;
    }
    return true;
}

function clearOldBeats() {
    Object.keys(heartbeats).forEach(function (id) {
        var beat = heartbeats[id];
        if (Date.now() - beat['ts'] >= EXPIRE_DELTA) {
            delete heartbeats[id];
        }
    });
}

