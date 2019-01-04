var request = require('supertest'),
    config = require('ghost-ignition').config(),
    should = require('should'),
    baseurl = 'http://localhost:3030';

should.equal(true, true);

describe('DownloadCount', function () {
    before(function (done) {
        require('../../app');
        setTimeout(done, 500);
    });
    describe('GET /', function () {
        it('should return count above initial config count', function (done) {
            let configCount = config.get('github:currentCount');
            request(baseurl)
                .get('/')
                .expect(200)
                .end(function (err, res) {
                    res.body.count.should.be.Number();
                    res.body.count.should.be.above(configCount);
                    done();
                });
        });
    });
});
