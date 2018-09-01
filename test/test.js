const request = require('supertest');
const app = require('../app');

// Test invalid path
describe('GET /invalid/path', function() {
    it('HTTP 404', function(done) {
        request(app)
        .get('/invalid/path')
        .set('Content-Type', 'application/json')
        .expect(404, done);
    });
});

describe('Content-type check', function() {
    // Expect something 415
    it('Invalid Content-Type', function(done) {
        request(app)
        .post('/api/register')
        .set('Content-Type', 'application/xml')
        .expect(415, done);
    });

    // Expect something not 415
    it('Valid Content-Type', function(done) {
        request(app)
        .post('/api/retrievefornotifications')
        .set('Content-Type', 'application/json')
        .expect(400, done);
    });
});
