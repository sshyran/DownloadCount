var express = require('express');
var logger = require('morgan');

var store = require('./lib/store');
var server = require('./lib/server');
var cron = require('./lib/cron');

var app = express();

app.use(logger('dev'));

// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

function corsHeaders(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Request-Method', 'GET');
    res.set('Cache-Control', 'no-cache');

    next();
}

app.get('/', corsHeaders, function(req, res, next) {
    res.status(200).json({'count': store.get() });
});

app.options('/', corsHeaders, function (req, res, next) {
    res.sendStatus(204);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// stacktraces only sent in development mode
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

server.start(app);
