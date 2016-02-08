var nconf = require('nconf'),
    path  = require('path');

nconf.argv()
    .env()
    .file({ file: path.join(process.cwd(), 'config.json')});

nconf.defaults({
    port: 3030
});

module.exports = nconf;