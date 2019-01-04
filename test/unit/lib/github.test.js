var config = require('ghost-ignition').config(),
    should = require('should'),
    github = require('../../../lib/github');

should.equal(true, true);

describe('Github', function () {
    it('should return initial configuration immediately', function () {
        let count = github.getDownloadsCount();
        let configCount = config.get('github:currentCount');
        count.should.be.Number();
        count.should.eql(configCount);
    });
});
