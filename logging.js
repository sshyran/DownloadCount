const config = require('ghost-ignition').config();
const loggly = config.get('logging:loggly') || {};

// Set the match to critical unless config says otherwise.
loggly.match = loggly.match || 'level:critical';

// see defaults in GhostLogger
const logging = require('ghost-ignition').logging({
    env: config.get('env'),
    path: config.get('logging:path'),
    domain: config.get('logging:domain'),
    mode: config.get('logging:mode'),
    level: config.get('logging:level'),
    transports: config.get('logging:transports'),
    loggly: loggly
});

module.exports = logging;
