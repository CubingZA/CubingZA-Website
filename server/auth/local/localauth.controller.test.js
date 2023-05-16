import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import config from '../../config/environment';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

jest.unstable_mockModule('../auth.service', function() {
  return {
    signToken: jest.fn().mockReturnValue('signed token'),
  }
});
const authService = (await import('../auth.service'));
const User = (await import('../../api/users/user.model')).default;
const controller = (await import('./localauth.controller'));

const passportSetup = (await import('./passport')).setup;
passportSetup(User, config);

const mockUser = {
  name: "Test Person",
  email: "test@example.com",
  role: "user",
  provider: "local",
  password: "secure-password"
};

describe('Local Auth Controller', () => {

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = new Request();
    req.setBody({});
    req.auth = {};
    res = new Response();
    next = jest.fn();
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe('calling controller.authenticate', () => {

    describe('with missing credentials', () => {

      it("should respond with 401 Unauthorized", async () => {
        mockingoose(User).toReturn(null, 'findOne');
        controller.authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          message: "Missing credentials"
        });
      });
    });

    describe("with credentials in the body", () => {

      let finishTesting;
      let isBusyTesting;

      beforeEach(() => {
        req.body = {
          email: mockUser.email,
          password: mockUser.password
        };

        isBusyTesting = new Promise((resolve) => {
          finishTesting = resolve;
        });

        const endTheTest = ()=> {finishTesting();};
        next.mockImplementation(endTheTest);
        res.json.mockImplementation(endTheTest);
        res.end.mockImplementation(endTheTest);
        res.send.mockImplementation(endTheTest);
      });

      describe("with the correct password", () => {
        it("should set a cookie and respond 200 OK and the token", async () => {

          let user = new User(mockUser);
          user.authenticate = jest.fn().mockImplementation((password, callback) => {
            callback(null, true);
          });
          mockingoose(User).toReturn(user, 'findOne');

          controller.authenticate(req, res, next);

          await isBusyTesting;

          expect(res.cookie).toHaveBeenCalledWith('token', 'signed token');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({token: 'signed token'});
        });
      });

      describe("when the user is not found", () => {
        it("should respond 401 Unauthorized", async () => {

          mockingoose(User).toReturn(null, 'findOne');

          controller.authenticate(req, res, next);

          await isBusyTesting;

          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith({
            message: "This email is not registered."
          });
        });
      });

      describe("with the incorrect password", () => {
        it("should respond 401 Unauthorized", async () => {

          let user = new User(mockUser);
          user.authenticate = jest.fn().mockImplementation((password, callback) => {
            callback(null, false);
          });
          mockingoose(User).toReturn(user, 'findOne');

          controller.authenticate(req, res, next);

          await isBusyTesting;

          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith({
            message: "This password is not correct."
          });
        });
      });

      describe("with a WCA user without a password", () => {
        it("should respond 401 Unauthorised", async () => {

          let user = new User(mockUser);
          user.provider = ["wca"];
          user.password = undefined;
          user.authenticate = jest.fn().mockImplementation((password, callback) => {
            callback(null, true);
          });
          mockingoose(User).toReturn(user, 'findOne');

          controller.authenticate(req, res, next);

          await isBusyTesting;

          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith({
            message: "This account requires logging in using a WCA account."
          });
        });
      });

      describe("with an error when trying to authenticate", () => {
        it("should respond 401 Unauthorised", async () => {

          let testError = new Error("Test Error");

          let user = new User(mockUser);
          user.authenticate = jest.fn().mockImplementation((password, callback) => {
            callback(testError, false);
          });
          mockingoose(User).toReturn(user, 'findOne');

          controller.authenticate(req, res, next);

          await isBusyTesting;

          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith(testError);
        });
      });

      describe("with an error when trying to find the user", () => {
        it("should respond 401 Unauthorised", async () => {

          let testError = new Error("Test Error");

          mockingoose(User).toReturn(testError, 'findOne');

          controller.authenticate(req, res, next);

          await isBusyTesting;

          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledWith(testError);
        });
      });

    });
  });
});
