'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var recordCtrlStub = {
  index: 'recordCtrl.index',
  show: 'recordCtrl.show',
  create: 'recordCtrl.create',
  upsert: 'recordCtrl.upsert',
  patch: 'recordCtrl.patch',
  destroy: 'recordCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var recordIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './record.controller': recordCtrlStub
});

describe('Record API Router:', function() {
  it('should return an express router instance', function() {
    expect(recordIndex).to.equal(routerStub);
  });

  describe('GET /api/records', function() {
    it('should route to record.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'recordCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

});
