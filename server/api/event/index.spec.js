'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var eventCtrlStub = {
  index: 'eventCtrl.index',
  show: 'eventCtrl.show',
  create: 'eventCtrl.create',
  upsert: 'eventCtrl.upsert',
  patch: 'eventCtrl.patch',
  destroy: 'eventCtrl.destroy',
  upcoming: 'eventCtrl.upcoming'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var eventIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './event.controller': eventCtrlStub
});

describe('Event API Router:', function() {
  it('should return an express router instance', function() {
    expect(eventIndex).to.equal(routerStub);
  });

  describe('GET /api/events', function() {
    it('should route to event.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'eventCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/events/upcoming', function() {
    it('should route to event.controller.upcoming', function() {
      expect(routerStub.get
        .withArgs('/upcoming', 'eventCtrl.upcoming')
        ).to.have.been.calledOnce;
    });
  });
});
