var request = require('request-promise');
var config = require('ghost-ignition').config();
var debug = require('ghost-ignition').debug('daisy');
var errors = require('ghost-ignition').errors;
var querystring = require('querystring');
var logging = require('../logging');
var queryParams = querystring.stringify({
    client_id: config.get('daisy:client_id'),
    client_secret: config.get('daisy:client_secret')
});

// current events count
var count = config.get('daisy:currentCount');
var errorOccurred = false;

(function retry() {
    request
        .head(config.get('daisy:url') + '/api/v2/events?' + queryParams)
        .then(function (headers) {
            count = Number(headers['x-total-count-blogs-added']) + Number(headers['x-total-count-blogs-updated']);
            debug('Fetched new Daisy.js count');
            debug(count);
        })
        .catch(function (err) {
            err = new errors.InternalServerError({
                err: err,
                message: 'Problem fetching events count from Daisy.js',
                level: 'critical'
            });

            logging.error(err);
            errorOccurred = true;
        })
        .finally(function () {
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                errorOccurred = false;

                retry();
            }, errorOccurred ? 1000 * 60 : config.get('daisy:requestTimeout'));
        });
}());

exports.fetchEventsCount = function () {
    return count;
};