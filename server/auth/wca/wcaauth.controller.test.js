import {jest} from '@jest/globals';
import nock from 'nock';
import mockingoose from 'mockingoose';
import config from '../../config/environment/index.js';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

jest.unstable_mockModule('../auth.service.js', function() {
  return {
    signToken: jest.fn().mockReturnValue('signed token'),
  }
});
const authService = (await import('../auth.service.js'));
const User = (await import('../../api/users/user.model.js')).default;
const controller = (await import('./wcaauth.controller.js'));

const passportSetup = (await import('./passport.js')).setup;
passportSetup(User, config);

const mockUser = {
  name: "Test Person",
  email: "test@example.com",
  role: "user",
  provider: ["wca"]
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
    email: "test@example.com",
    wca_id: "2014TEST01",
    country_iso2: "ZA",
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
        /^https:\/\/staging\.worldcubeassociation\.org\/oauth\/authorize\?/
      );
    });

    it("should use the next parameter to set the session redirect URL", async () => {
      let nextUrl = "https://example.com/next";
      req.query.next = nextUrl;

      controller.authenticate(req, res, next);
      await isBusyTesting;

      expect(req.session.redirectUrl).toEqual(nextUrl);
    });

    it("should set the user to merge if the session has an authenticated user", async () => {
      req.auth = mockUser;

      controller.authenticate(req, res, next);
      await isBusyTesting;

      expect(req.session.isMerge).toEqual(true);
      expect(req.session.mergeUser).toEqual(
        expect.objectContaining(mockUser)
      );
    });

    it("should not set a merge if the user is not authenticated", async () => {
      req.auth = undefined;

      controller.authenticate(req, res, next);
      await isBusyTesting;

      expect(req.session.isMerge).toEqual(false);
      expect(req.session.mergeUser).toEqual(undefined);
    });
  });

  describe('calling controller.callback', () => {

    beforeEach(async () => {
      delete req.auth
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

          describe("with no redirect URL set", () => {

            beforeEach(() => {
              mockingoose(User).toReturn({
                ...mockUser,
                _id: "6481bdedc02740d8446730fc"  // Always return the same user ID
              }, 'findOne');
            });

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

            beforeEach(() => {
              mockingoose(User).toReturn({
                ...mockUser,
                _id: "6481bdedc02740d8446730fc"  // Always return the same user ID
              }, 'findOne');
            });

            it("should set a cookie and redirect to the redirect URL", async () => {
              let redirectUrl = "https://example.com/redirect";
              req.session.redirectUrl = redirectUrl;

              controller.callback(req, res, next);
              await isBusyTesting;

              expect(res.cookie).toHaveBeenCalledWith("token", "signed token");
              expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
              expect(res.json).not.toHaveBeenCalled();
            });
          });

        });

        describe("syncing the WCA profile", () => {

          it ("should update the user's WCA ID", async () => {
            let testUser = new User({
              ...mockUser,
              wcaID: "WRONGID"
            });
            mockingoose(User).toReturn(testUser, 'findOne');

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(testUser.save).toHaveBeenCalled();
            expect(testUser.wcaID).toEqual("2014TEST01");
          });

          it ("should update the user's country ID", async () => {
            let testUser = new User({
              ...mockUser,
              wcaCountryID: "US"
            });
            mockingoose(User).toReturn(testUser, 'findOne');

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(testUser.save).toHaveBeenCalled();
            expect(testUser.wcaCountryID).toEqual("ZA");
          });

          it ("should update the user's name ID", async () => {
            let testUser = new User({
              ...mockUser,
              name: "Changed Name"
            });
            mockingoose(User).toReturn(testUser, 'findOne');

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(testUser.save).toHaveBeenCalled();
            expect(testUser.name).toEqual("Test Person");
          });

          it ("should not save the user if there is an email mismatch", async () => {
            let testUser = new User({
              ...mockUser,
              email: "different@example.com",
              wcaID: "WRONGID"
            });
            mockingoose(User).toReturn(testUser, 'findOne');

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(testUser.save).not.toHaveBeenCalled();
          });

          it ("should not save the user if the ID, country and name are correct", async () => {
            let testUser = new User({
              ...mockUser,
              wcaID: "2014TEST01",
              wcaCountryID: "ZA",
              name: "Test Person"
            });
            mockingoose(User).toReturn(testUser, 'findOne');

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(testUser.save).not.toHaveBeenCalled();
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

      describe("with a user that does not have WCA as a provider", () => {

        let testUser;

        beforeEach(() => {
          testUser = new User({
            ...mockUser,
            _id: "6481bdedc02740d8446730fc",  // Always return the same user ID
            provider: ["local"],
            wcaID: "WRONGID",
            wcaCountryID: "US",
            name: "Changed Name"
          });
          mockingoose(User).toReturn(testUser, 'findOne');

          nock('https://staging.worldcubeassociation.org')
          .get('/api/v0/me')
          .reply(200, mockValidWCAMeResponse);
        });

        describe("when the user needs to be merged", () => {

          it("should merge the user and log in", async () => {
            req.session.isMerge = true;
            req.session.mergeUser = testUser,
            req.session.redirectUrl = "https://example.com/redirect";

            expect(testUser.name).toEqual("Changed Name");
            expect(testUser.wcaID).toEqual("WRONGID");
            expect(testUser.wcaCountryID).toEqual("US");

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(testUser.save).toHaveBeenCalled();

            expect(testUser.name).toEqual("Test Person");
            expect(testUser.wcaID).toEqual("2014TEST01");
            expect(testUser.wcaCountryID).toEqual("ZA");

            expect(res.redirect).toHaveBeenCalledWith(req.session.redirectUrl);
          });
        });

        describe("when the user should not be merged", () => {

          it("should redirect to the login page", async () => {
            req.session.isMerge = false;

            controller.callback(req, res, next);
            await isBusyTesting;

            expect(res.redirect).toHaveBeenCalledWith('/login');
            expect(User.prototype.save).not.toHaveBeenCalled();
          });
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
