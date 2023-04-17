import {jest} from '@jest/globals';
import nock from 'nock';
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
const controller = (await import('./wcaauth.controller'));

const passportSetup = (await import('./passport')).setup;
passportSetup(User, config);

const mockUser = {
  name: "Test Person",
  email: "test@example.com",
  role: "user",
  provider: "wca"
};

const mockValidWCAAuthCodeResponse = {
  "access_token": "test-access-token",
  "token_type": "Bearer",
  "expires_in": 7199,
  "refresh_token": "test-refresh-token",
  "scope": "public email",
  "created_at": 1610000000
};

const mockValidWCAMeResponse = {
  me: {
    name: "Test Person",
    email: "test@example.com"
  }
};

describe('WCA Auth Controller', () => {

  let req;
  let res;
  let next;

  let finishTesting;
  let isBusyTesting;

  function resetWait() {
    isBusyTesting = new Promise((resolve) => {
      finishTesting = resolve;
    });
  }

  beforeEach(() => {
    req = new Request();
    req.setBody({});
    req.auth = {};
    req.session = {};
    res = new Response();
    next = jest.fn();
    jest.clearAllMocks();
    mockingoose.resetAll();

    resetWait();

    const endTheTest = () => {finishTesting();};
    next.mockImplementation(endTheTest);
    res.json.mockImplementation(endTheTest);
    res.end.mockImplementation(endTheTest);
    res.send.mockImplementation(endTheTest);
    res.redirect.mockImplementation(endTheTest);
  });

  describe('calling controller.authenticate', () => {

    it("should redirect to the WCA OAuth2 endpoint", async () => {
      controller.authenticate(req, res, next);
      await isBusyTesting;

      expect(res.statusCode).toEqual(302);
      expect(res.headers['Location']).toMatch(
        /^https:\/\/staging.worldcubeassociation.org\/oauth\/authorize\?/
      );
    });

    it("should use the next parameter to set the session redirect URL", async () => {
      let nextUrl = "https://example.com/next";
      req.query.next = nextUrl;

      controller.authenticate(req, res, next);
      await isBusyTesting;

      expect(req.session.redirectUrl).toEqual(nextUrl);
    });
  });

  describe('calling controller.callback', () => {

    beforeEach(async () => {
      controller.authenticate(req, res, next);
      await isBusyTesting;
      resetWait();

      req.query.code = "12345";
      req.query.state = req.session['oauth2:staging.worldcubeassociation.org'].state.handle;
    });

    describe('with a valid code', () => {

      beforeEach(() => {
        nock('https://staging.worldcubeassociation.org')
          .post('/oauth/token', () => true)
          .reply(200, mockValidWCAAuthCodeResponse);
      });

      describe('with a valid WCA user', () => {

        beforeEach(() => {
          nock('https://staging.worldcubeassociation.org')
            .get('/api/v0/me')
            .reply(200, mockValidWCAMeResponse);
        });

        describe("with a user that doesn't exist", () => {

          beforeEach(() => {
            mockingoose(User).toReturn(null, 'findOne');
          });

          it("should create a new user", async () => {
            controller.callback(req, res, next);
            await isBusyTesting;

            expect(User.prototype.save).toHaveBeenCalled();
            expect(User.prototype.save.mock.instances.length).toEqual(1);
            expect(User.prototype.save.mock.instances).toEqual(
              expect.arrayContaining([expect.objectContaining(mockUser)])
            );
          });

          describe("with no redirect URL set", () => {

            it("should return the signed token", async () => {

              controller.callback(req, res, next);
              await isBusyTesting;

              expect(res.json).toHaveBeenCalledWith({
                token: 'signed token'
              });
              expect(res.redirect).not.toHaveBeenCalled();
            });
          });

          describe("with a redirect URL set", () => {

            it("should redirect to the redirect URL", async () => {
              let redirectUrl = "https://example.com/redirect";
              req.session.redirectUrl = redirectUrl;

              controller.callback(req, res, next);
              await isBusyTesting;

              expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
              expect(res.json).not.toHaveBeenCalled();
            });
          });
        });

        describe("with a user that already exists", () => {

          beforeEach(() => {
            mockingoose(User).toReturn(mockUser, 'findOne');
          });

          it("should not create a new user", async () => {
            controller.callback(req, res, next);
            await isBusyTesting;

            expect(User.prototype.save).not.toHaveBeenCalled();
          });

          describe("with no redirect URL set", () => {

            it("should return the signed token", async () => {
              controller.callback(req, res, next);
              await isBusyTesting;

              expect(res.json).toHaveBeenCalledWith({
                token: 'signed token'
              });
              expect(res.redirect).not.toHaveBeenCalled();
            });
          });

          describe("with a redirect URL set", () => {

            it("should redirect to the redirect URL", async () => {
              let redirectUrl = "https://example.com/redirect";
              req.session.redirectUrl = redirectUrl;

              controller.callback(req, res, next);
              await isBusyTesting;

              expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
              expect(res.json).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('with an error while fetching the WCA user', () => {

        beforeEach(() => {
          nock('https://staging.worldcubeassociation.org')
            .get('/api/v0/me')
            .reply(500, "Internal Server Error");
        });

        it("should redirect to the login page", async () => {
          controller.callback(req, res, next);
          await isBusyTesting;

          expect(res.redirect).toHaveBeenCalledWith('/login');
        });
      });

      describe('when no profile is returned', () => {

        beforeEach(() => {
          nock('https://staging.worldcubeassociation.org')
            .get('/api/v0/me')
            .reply(200, {});
        });

        it("should redirect to the login page", async () => {
          controller.callback(req, res, next);
          await isBusyTesting;

          expect(res.redirect).toHaveBeenCalledWith('/login');
        });
      });

      describe('with a database error', () => {

        beforeEach(() => {
          mockingoose(User).toReturn(new Error("Database error"), 'findOne');
        });

        it("should redirect to the login page", async () => {
          controller.callback(req, res, next);
          await isBusyTesting;

          expect(res.redirect).toHaveBeenCalledWith('/login');
        });
      });
    });

    describe('with an invalid code', () => {

      beforeEach(() => {
        nock('https://staging.worldcubeassociation.org')
          .post('/oauth/token', () => true)
          .reply(400, "Bad Request");
      });

      it("should redirect to the login page", async () => {
        controller.callback(req, res, next);
        await isBusyTesting;

        expect(res.redirect).toHaveBeenCalledWith('/login');
      });
    });

    describe('with an invalid session state', () => {

      beforeEach(() => {
        req.query.state = "invalid state";
      });

      it("should redirect to the login page", async () => {
        controller.callback(req, res, next);
        await isBusyTesting;

        expect(res.redirect).toHaveBeenCalledWith('/login');
      });
    });
  });
});
