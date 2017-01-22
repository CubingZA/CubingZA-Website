'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var contactCtrlStub = {
  index: 'contactCtrl.index',
  show: 'contactCtrl.show',
  create: 'contactCtrl.create',
  upsert: 'contactCtrl.upsert',
  patch: 'contactCtrl.patch',
  destroy: 'contactCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
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

  describe('GET /api/contacts', function() {
    it('should route to contact.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'contactCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/contacts/:id', function() {
    it('should route to contact.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'contactCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/contacts', function() {
    it('should route to contact.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'contactCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/contacts/:id', function() {
    it('should route to contact.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'contactCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/contacts/:id', function() {
    it('should route to contact.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'contactCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/contacts/:id', function() {
    it('should route to contact.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'contactCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
