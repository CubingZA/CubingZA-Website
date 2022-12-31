import {jest} from '@jest/globals';
import * as controller from "./record.controller"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

jest.unstable_mockModule('../../auth/auth.service', ()=>({
  isAuthenticated: jest.fn(()=>'authService.isAuthenticated'),
  hasRole: jest.fn((role)=>`authService.hasRole.${role}`)
}));
const authService = (await import('../../auth/auth.service'));


describe('Record API Router:', function() {
  
  let recordRouter;
  beforeEach(async function() {
    recordRouter = (await import('./index')).default;
  });  

  it('should return an express router instance', function() {
    expect(recordRouter).toEqual(routerMock);
  });

  describe('GET /api/records', function() {
    it('should route to record.controller.index', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/', controller.index);
    });
  });

  describe('GET /api/records/:id', function() {
    it('should route to record.controller.show', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:id', controller.show);
    });
  });

  describe('PUT /api/records', function() {
    it('should verify admin role and route to record.controller.upsert', function() {
      expect(routerMock.put)
        .toHaveBeenCalledWith('/:id', "authService.hasRole.admin", controller.upsert);
    });
  });

});
