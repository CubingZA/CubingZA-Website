import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'signed token'),
    decode: jest.fn(() => 'decoded token')
  }
});
const jwt = (await import('jsonwebtoken')).default;

const mockValidateJwt = jest.fn();

jest.mock('express-jwt', () => {
  return {
    expressjwt: jest.fn().mockReturnValue(mockValidateJwt)
  }
});
const expressjwt = (await import('express-jwt')).expressjwt;

const mockUser = {
  name: "Test Person",
  role: "user"
};

const mockAdmin = {
  name: "Test Admin",
  role: "admin"
};

const mockUnverifiedUser = {
  name: "Test Unverified",
  role: "unverified"
};


const User = (await import('../api/users/user.model')).default;

const authService = (await import('./auth.service'));

describe('Auth Service', () => {

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

  describe('calling isAuthenticated', () => {

    it("should return a function that accepts 3 arguments", () => {
      expect(typeof authService.isAuthenticated()).toBe('function');
      expect(authService.isAuthenticated().length).toBe(3);
    });

    it('should validate the JWT', () => {
      authService.isAuthenticated()(req, res, next);
      expect(mockValidateJwt).toHaveBeenCalled();
    });

    it('should attach the user to the request and call next if the JWT is valid and the user is found', async () => {
      mockValidateJwt.mockImplementation((req, res, next) => {next()});

      const user = new User(mockUser);
      mockingoose(User).toReturn(user, 'findById');
      mockingoose(User).toReturn(user, 'findOne');

      expect(req.auth).toEqual({});

      await authService.isAuthenticated()(req, res, next);

      expect(req.auth).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('should respond 401 Unauthorized if the JWT is valid but the user is not found', async () => {
      mockValidateJwt.mockImplementation((req, res, next) => {next()});

      mockingoose(User).toReturn(null, 'findById');
      mockingoose(User).toReturn(null, 'findOne');

      await authService.isAuthenticated()(req, res, next);

      expect(req.auth).toEqual({});
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    it ('should error if the JWT is invalid', async () => {
      mockValidateJwt.mockImplementation((req, res, next) => {next('jwt error')});

      const user = new User(mockUser);
      mockingoose(User).toReturn(user, 'findById');
      mockingoose(User).toReturn(user, 'findOne');

      await authService.isAuthenticated()(req, res, next);

      expect(req.auth).toEqual({});
    });
  });

  describe('calling hasRole', () => {

    beforeEach(() => {
      mockValidateJwt.mockImplementation((req, res, next) => {next()});
    });

    it('should return a function that accepts 3 arguments', () => {
      expect(typeof authService.hasRole('user')).toBe('function');
      expect(authService.hasRole('user').length).toBe(3);
    });

    it('should error if the role is not set', async () => {
      expect(() => authService.hasRole()).toThrow();
    });

    describe('as an admin', () => {

      beforeEach(() => {
        mockingoose(User).toReturn(new User(mockAdmin), 'findById');
        mockingoose(User).toReturn(new User(mockAdmin), 'findOne');
      });

      it('should call next if admin role is required', async () => {
        await authService.hasRole('admin')(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should call next if the user role is required', async () => {
        await authService.hasRole('user')(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should call next if the unverified role is required', async () => {
        await authService.hasRole('unverified')(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('as a user', () => {

      beforeEach(() => {
        mockingoose(User).toReturn(new User(mockUser), 'findById');
        mockingoose(User).toReturn(new User(mockUser), 'findOne');
      });

      it('should call next if a user requires the user role', async () => {
        await authService.hasRole('user')(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should call next if a user requires the unverified role', async () => {
        await authService.hasRole('unverified')(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should respond 403 Forbidden if a user requires the admin role', async () => {
        await authService.hasRole('admin')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Forbidden");
      });
    });

    describe('as an unverified user', () => {

      beforeEach(() => {
        mockingoose(User).toReturn(new User(mockUnverifiedUser), 'findById');
        mockingoose(User).toReturn(new User(mockUnverifiedUser), 'findOne');
      });

      it('should call next if an unverified user requires the unverified role', async () => {
        await authService.hasRole('unverified')(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should respond 403 Forbidden if an unverified user requires the user role', async () => {
        await authService.hasRole('user')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Forbidden");
      });

      it('should respond 403 Forbidden if an unverified user requires the admin role', async () => {
        await authService.hasRole('admin')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Forbidden");
      });
    });

    describe('as an unauthenticated user', () => {

      beforeEach(() => {
        mockingoose(User).toReturn(null, 'findById');
        mockingoose(User).toReturn(null, 'findOne');
      });

      it('should respond 401 Unauthorized if the user is not authenticated', async () => {
        await authService.hasRole('user')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.end).toHaveBeenCalled();
      });
    });
  });

  describe('calling signToken', () => {

    it('should sign a token', async () => {
      authService.signToken('test id', 'test role');

      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: 'test id', role: 'test role' },
        'test-secret',
        { expiresIn: 60*60*5 }
      );
    });
  });

  describe('calling setTokenCookie', () => {

      it('should set a cookie and redirect to /', async () => {
        let user = new User(mockUser);
        req.auth = user;

        authService.setTokenCookie(req, res);

        expect(res.cookie).toHaveBeenCalledWith('token', 'signed token');
        expect(res.redirect).toHaveBeenCalledWith('/');

        expect(jwt.sign).toHaveBeenCalledWith(
          { _id: user._id, role: 'user' },
          'test-secret',
          { expiresIn: 60*60*5 }
        );
      });

      it('should respond 403 Forbidden if not authenticated', async () => {
        req.auth = undefined;

        authService.setTokenCookie(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(jwt.sign).not.toHaveBeenCalled();
      });
    });

});