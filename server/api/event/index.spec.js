'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var eventCtrlStub = {
  index: 'eventCtrl.index',
  show: 'eventCtrl.show',
  create: 'eventCtrl.create',
  upsert: 'eventCtrl.upsert',
  patch: 'eventCtrl.patch',
  destroy: 'eventCtrl.destroy'
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

  describe('GET /api/events/:id', function() {
    it('should route to event.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'eventCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/events', function() {
    it('should route to event.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'eventCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/events/:id', function() {
    it('should route to event.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'eventCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/events/:id', function() {
    it('should route to event.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'eventCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/events/:id', function() {
    it('should route to event.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'eventCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
