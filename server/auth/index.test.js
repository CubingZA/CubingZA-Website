import {jest} from '@jest/globals';

import localAuth from './local/index.js';
import wcaAuth from './wca/index.js';

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);


describe('Auth API Router:', function() {

  let authRouter;
  beforeEach(async function() {
    authRouter = (await import('./index.js')).default;
  });

  it('should return an express router instance', function() {
    expect(authRouter).toEqual(routerMock);
  });

  describe('subroute /auth/local', function() {
    it('should use local auth', function() {
      expect(routerMock.use)
        .toHaveBeenCalledWith('/local', localAuth);
    });
  });

  describe('subroute /auth/wca', function() {
    it('should use wca auth', function() {
      expect(routerMock.use)
        .toHaveBeenCalledWith('/wca', wcaAuth);
    });
  });

});
