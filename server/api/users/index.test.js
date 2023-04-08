import {jest} from '@jest/globals';
import * as controller from "./user.controller"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

jest.unstable_mockModule('../../auth/auth.service', ()=>({
  isAuthenticated: jest.fn(()=>'authService.isAuthenticated'),
  hasRole: jest.fn((role)=>`authService.hasRole.${role}`)
}));
const authService = (await import('../../auth/auth.service'));


describe('User API Router:', function() {
  
  let userRouter;
  beforeEach(async function() {
    userRouter = (await import('./index')).default;
  });  

  it('should return an express router instance', function() {
    expect(userRouter).toEqual(routerMock);
  });

  describe('GET /api/users', function() {
    it('should verify admin role and route to user.controller.index', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/', "authService.hasRole.admin", controller.index);
    });
  });

  describe('POST /api/users', function() {
    it('should route to user.controller.create', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/', controller.create);
    });
  });

  describe('GET /api/users/:id', function() {
    it('should verify user role and route to user.controller.show', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:id', "authService.hasRole.user", controller.show);
    });
  });

  describe('DELETE /api/users/:id', function() {
    it('should verify admin role and route to user.controller.destroy', function() {
      expect(routerMock.delete)
        .toHaveBeenCalledWith('/:id', "authService.hasRole.admin", controller.destroy);
    });
  });

  describe('GET /api/users/me', function() {
    it('should be authenticated and route to user.controller.me', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/me', "authService.isAuthenticated", controller.me);
    });
  });

  describe('POST /api/users/verify', function() {
    it('should route to user.controller.verify', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/verify', controller.verify);
    });
  });

  describe('POST /api/users//me/verifications/send', function() {
    it('should check for unverified user and route to user.controller.sendVerificationEmail', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/me/verifications/send', "authService.hasRole.unverified", controller.sendVerificationEmail);
    });
  });
  
  describe('GET /api/users/me/notifications', function() {
    it('should be verify user roler and route to user.controller.getNotifications', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/me/notifications', "authService.hasRole.user", controller.getNotifications);
    });
  });

  describe('POST /api/users/me/notifications', function() {
    it('should be verify user roler and route to user.controller.saveNotifications', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/me/notifications', "authService.hasRole.user", controller.saveNotifications);
    });
  });

});
