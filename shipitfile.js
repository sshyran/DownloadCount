function init(shipit) {
  require('ghost-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: './',
      deployTo: '/opt/downloadcount/',
      ignores: ['.git', 'node_modules'],
      sharedLinks: [{
        name: 'node_modules',
        type: 'directory'
      }, {
        name: 'config.production.json',
        type: 'file'
      }]
    },
    staging: {
      servers: process.env.STG_USER + '@' + process.env.STG_SERVER
    },
    production: {
      servers: process.env.PRD_USER + '@' + process.env.PRD_SERVER
    }
  });
}
module.exports = init;