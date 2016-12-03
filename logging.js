var config = require('ghost-ignition').config();

var logging = require('ghost-ignition').logging({
    env: config.get('env'),
    path: config.get('logging:path'),
    domain: config.get('logging:domain'),
    mode: config.get('logging:mode'),
    level: config.get('logging:level'),
    transports: config.get('logging:transports')
});

module.exports = logging;