import {jest} from '@jest/globals';
import * as controller from "./event.controller.js"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

jest.unstable_mockModule('../../auth/auth.service.js', ()=>({
  isAuthenticated: jest.fn(()=>'authService.isAuthenticated'),
  hasRole: jest.fn((role)=>`authService.hasRole.${role}`)
}));
const authService = (await import('../../auth/auth.service.js'));


describe('Event API Router:', function() {

  let eventRouter;
  beforeEach(async function() {
    eventRouter = (await import('./index')).default;
  });

  it('should return an express router instance', function() {
    expect(eventRouter).toEqual(routerMock);
  });

  describe('GET /api/events', function() {
    it('should route to event.controller.index', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/', controller.index);
    });
  });

  describe('POST /api/events', function() {
    it('should verify admin role and route to event.controller.index', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/', "authService.hasRole.admin", controller.create);
    });
  });

  describe('GET /api/events/upcoming', function() {
    it('should route to event.controller.upcoming', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/upcoming', controller.upcoming);
    });
  });

  describe('GET /api/events/:id', function() {
    it('should route to event.controller.show', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:id', controller.show);
    });
  });

  describe('PUT /api/events/:id', function() {
    it('should verify admin role and route to event.controller.upsert', function() {
      expect(routerMock.put)
        .toHaveBeenCalledWith('/:id', "authService.hasRole.admin", controller.upsert);
    });
  });

  describe('DELETE /api/events/:id', function() {
    it('should verify admin role and route to event.controller.destroy', function() {
      expect(routerMock.delete)
        .toHaveBeenCalledWith('/:id', "authService.hasRole.admin", controller.destroy);
    });
  });

  describe('GET /api/events/:id/notify', function() {
    it('should verify admin role and route to event.controller.sendNotifications', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/:id/notify', "authService.hasRole.admin", controller.sendNotifications);
    });
  });

});
