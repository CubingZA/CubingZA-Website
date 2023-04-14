import {jest} from '@jest/globals';
import * as controller from "./contact.controller"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

describe('Contact API Router:', function() {

  let contactRouter;
  beforeEach(async function() {
    contactRouter = (await import('./index')).default;
  });  

  it('should return an express router instance', function() {
    expect(contactRouter).toEqual(routerMock);
  });

  describe('POST /api/contact/send', function() {
    it('should route to contact.controller.send', function() {
      expect(routerMock.post).toHaveBeenCalledWith('/send', controller.send);
    });
  });
});
