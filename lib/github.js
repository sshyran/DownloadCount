var ghrepos = require('ghrepos');
var errors = require('ghost-ignition').errors;
var config = require('ghost-ignition').config();
var debug = require('ghost-ignition').debug('github');
var logging = require('../logging');
var auth = {
    token: config.get('github:token')
};
var options = {
    headers: {
        'user-agent': 'Ghost Download Count Service'
    }
};

var ghList = ghrepos.createLister('releases');

// current github count
var count = config.get('github:currentCount');
var timeout;

(function retry() {
    ghList(auth, 'TryGhost', 'Ghost', options, function (err, list) {
        if (err) {
            err = new errors.InternalServerError({
                err: err,
                message: 'Request to Github does not work.',
                level: 'critical'
            });

            logging.error(err);

            timeout = setTimeout(function () {
                clearTimeout(timeout);
                retry();
            }, config.get('github:requestTimeout'));

            return;
        }

        var newCount = 0;

        try {
            list.forEach(function (item) {
                newCount += item.assets[0].download_count;
            });

            count = newCount;

            debug('Fetched new Github count');
            debug(count);

            timeout = setTimeout(function () {
                clearTimeout(timeout);
                retry();
            }, config.get('github:requestTimeout'));
        } catch (err) {
            err = new errors.InternalServerError({
                err: err,
                message: 'Cannot read Github response',
                level: 'critical'
            });

            logging.error(err);

            timeout = setTimeout(function () {
                clearTimeout(timeout);
                retry();
            }, config.get('github:requestTimeout'));
        }
    });
}());

exports.getDownloadsCount = function getReleases() {
    return count;
};
