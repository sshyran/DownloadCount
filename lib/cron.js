var request = require('request');
var config = require('./config');
var store = require('./store');
var debug = require('debug')('count:cron');

var milliseconds = config.get('ping') * 1000;

if (config.get('ping') && config.get('endpoint')) {
    debug('Starting ping every', config.get('ping'), 'seconds');
    setInterval(function () {
        debug('Fetching', config.get('endpoint'));
        request({url: config.get('endpoint'), json: true}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                debug('Fetched', body.count); // Show the HTML for the Google homepage.
                store.set(body.count);
            }
        });

    }, (milliseconds));
} else {
    debug('Ping not started, ping and endpoint config are missing');
}