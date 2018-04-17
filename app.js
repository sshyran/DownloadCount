var express = require('express');
var config = require('ghost-ignition').config();
var server = require('ghost-ignition').server;
var errors = require('ghost-ignition').errors;
var github = require('./lib/github');
var daisy = require('./lib/daisy');
var logRequest = require('./middlewares/log-request');
var currentCount = '';

var app = express();

app.use(logRequest);

// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

function corsHeaders(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Request-Method', 'GET');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Accept-Language')

    // set cloudflare cache header to 1 hour
    res.set('Cache-Control', 'public, max-age=3600');
    next();
}

app.get('/', corsHeaders, function (req, res, next) {
    var count = config.get('historicalCountValue');

    count += github.getDownloadsCount();
    count += daisy.fetchEventsCount();

    res.status(200).json({
        count: count
    });
});

app.options('/', corsHeaders, function (req, res, next) {
    res.sendStatus(204);
});

app.use(function (req, res, next) {
    next(new errors.NotFoundError());
});

app.use(function (err, req, res, next) {
    req.err = err;
    res.status(err.status || 500);

    res.json(errors.utils.serialize(err));
});

server.start(app);
