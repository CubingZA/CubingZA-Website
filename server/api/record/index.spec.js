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

  describe('GET /api/records/:id', function() {
    it('should route to record.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'recordCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/records', function() {
    it('should route to record.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'recordCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/records/:id', function() {
    it('should route to record.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'recordCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/records/:id', function() {
    it('should route to record.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'recordCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/records/:id', function() {
    it('should route to record.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'recordCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
