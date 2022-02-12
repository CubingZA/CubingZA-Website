'use strict';

var app = require('../..');
import request from 'supertest';

import mailgunConfig from './mailgunConfig'

var response;
var mailgunLog = {
  payload: '',
  logger: function (options, payload) {
    mailgunLog.payload = payload;
  }
};

describe('Contact API:', function() {
    describe('POST /api/contact/send', function() {
    beforeEach(function(done) {
      sinon.stub(mailgunConfig, 'getOptions').returns({
        apiKey: 'TESTAPIKEY',
        testMode: true,
        testModeLogger: mailgunLog.logger
      });
      request(app)
        .post('/api/contact/send')
        .send({
          name: 'Test Person',
          email: 'bob@test.com',
          subject: 'Subject of the email',
          message: 'This is a test message'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          response = res.body;
          done();
        });
    });

    afterEach(function(done) {
      sinon.restore(mailgunConfig);
      done();
    });

    it('should respond with a success message', function() {
      expect(response.success).to.equal(true);
      expect(response.message).to.equal('Message successfully sent');
    });

    it('should have called mailgun with the correct payload', function() {
      let expectedPayload = 'from=Test%20Person%20%3Cbob%40test.com%3E&' + 
        'to=info%40m.cubingza.org&' + 
        'subject=Subject%20of%20the%20email&' + 
        'text=This%20is%20a%20test%20message';
      expect(mailgunLog.payload).to.equal(expectedPayload);
    });
  });
});
