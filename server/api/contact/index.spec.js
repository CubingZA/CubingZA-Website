'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var contactCtrlStub = {
  index: 'contactCtrl.index',
  send: 'contactCtrl.send',
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy()
};

// require the index with our stubbed out modules
var contactIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './contact.controller': contactCtrlStub
});

describe('Contact API Router:', function() {
  it('should return an express router instance', function() {
    expect(contactIndex).to.equal(routerStub);
  });

  describe('POST /api/contact/send', function() {
    it('should route to contact.controller.send', function() {
      expect(routerStub.post
        .withArgs('/send', 'contactCtrl.send')
        ).to.have.been.calledOnce;
    });
  });
});
