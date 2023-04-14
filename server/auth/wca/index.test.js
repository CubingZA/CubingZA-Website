import {jest} from '@jest/globals';
import * as controller from "./wcaauth.controller"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

describe('WCA Auth API Router:', function() {
  
  let wcaAuthRouter;
  beforeEach(async function() {
    wcaAuthRouter = (await import('./index')).default;
  });  

  it('should return an express router instance', function() {
    expect(wcaAuthRouter).toEqual(routerMock);
  });

  describe('GET /auth/wca', function() {
    it('should route to wcaauth.controller.authenticate', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/', controller.authenticate);
    });
  });

  describe('GET /auth/wca/callback', function() {
    it('should route to wcaauth.controller.callback', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/callback', controller.callback);
    });
  });

});
