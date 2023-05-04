import {jest} from '@jest/globals';
import * as controller from "./localauth.controller"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

describe('Local Auth API Router:', function() {
  
  let localAuthRouter;
  beforeEach(async function() {
    localAuthRouter = (await import('./index')).default;
  });  

  it('should return an express router instance', function() {
    expect(localAuthRouter).toEqual(routerMock);
  });

  describe('POST /auth/local', function() {
    it('should route to localauth.controller.authenticate', function() {
      expect(routerMock.post)
        .toHaveBeenCalledWith('/', controller.authenticate);
    });
  });

});
