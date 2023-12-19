import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'test token')
  }
});
const jwt = (await import('jsonwebtoken')).default;

// Mock Email service
jest.unstable_mockModule('../../services/email/email.service', function() {
  return {
    send: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
    validate: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
  }
});
const emailService = (await import('../../services/email/email.service'));

const User = (await import('./user.model')).default;
const controller = (await import('./user.controller'));


const mockUserData = [
  {
    "name": "Test Person",
    "email": "test@example.com",
    "role": "user",
    "provider": ["local"],
    "password": "Encrypted-password--!",
    "notificationSettings": {
      "GT": true,
      "MP": false,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  },

  {
    "name": "Another one",
    "role": "user",
    "provider": ["wca"],
    "notificationSettings": {
      "GT": false,
      "MP": false,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  },
  {
    "name": "Unverified Person",
    "email": "test@example.com",
    "role": "unverified",
    "verificationToken": "test token",
    "notificationSettings": {
      "GT": false,
      "MP": true,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  },
  {
    "name": "Admin Guy",
    "email": "admin@example.com",
    "role": "admin",
    "notificationSettings": {
      "GT": true,
      "LM": false,
      "NW": false,
      "FS": false,
      "KZ": false,
      "EC": false,
      "WC": false,
      "NC": false
    }
  }
];


describe ("User controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = new Request();
    req.setBody({});
    req.auth = {};
    res = new Response();
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe("Calling controller.index", function () {

    it('should return a list of all users', async function() {
      mockingoose(User).toReturn(mockUserData, 'find');
      await controller.index({}, res);

      expect(res.status).toHaveBeenCalledWith(200);

      mockUserData.forEach(user => {
        expect(res.json).toHaveBeenCalledWith(
          expect.arrayContaining([expect.objectContaining(user)])
        );
      });
    });

    it('should handle errors correctly', async () => {
      const dbError = new Error('Database error');
      mockingoose(User).toReturn(dbError, 'find');
      await controller.index({}, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.send).toHaveBeenCalledWith(dbError);
    });
  });


  describe("Calling controller.show", function () {

    describe("when a user is found", function() {
      beforeEach(async function() {
        mockingoose(User).toReturn(mockUserData[0], 'findOne');
        req.params = {id: "0"}
        await controller.show(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of a single user", async function() {
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining(mockUserData[0])
        );
      });
    });

    describe("when a user is not found", function() {
      beforeEach(async function() {
        mockingoose(User).toReturn(null, 'findOne');
        req.params = {id: "9999"}
        await controller.show(req, res)
      });

      it("should respond with 404 Not Found status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });
    });
  });

  describe("Calling controller.create", function () {

    describe("with valid input", function() {

      let newUser;

      beforeEach(async function() {
        mockingoose(User).toReturn(null, 'findOne');
        mockingoose(User).toReturn(mockUserData[2], 'create');
        req.body = {
          "name": mockUserData[2].name,
          "email": mockUserData[2].email,
          "password": "password"
        };
        await controller.create(req, res)
        newUser = User().save.mock.instances[0];
      });

      it("should respond with 201 Created status", async function() {
        expect(res.status).toHaveBeenCalledWith(201);
      });

      it("should respond with a JWT token", async function() {
        expect(res.json).toHaveBeenCalledWith({token: "test token"});
      });

      it("should save the user", async function() {
        expect(User().save).toHaveBeenCalled();
      });

      it("should not have a plain text password", async function() {
        expect(newUser.password).not.toContain("password");
      });

      it("should set the provider to local", async function() {
        expect(newUser.provider).toStrictEqual(expect.arrayContaining(['local']));
      });

      it("should set the role to unverified", async function() {
        expect(newUser.role).toBe('unverified');
      });
    });

    describe("with email that already exists", function() {
      beforeEach(async function() {
        mockingoose(User).toReturn(mockUserData[2], 'findOne');
        req.body = {
          "name": mockUserData[2].name,
          "email": mockUserData[2].email,
          "password": "password"
        };
        await controller.create(req, res)
      });

      it("should respond with 400 Bad Request status", async function() {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe("Calling controller.destroy", function () {
    // let findByIdAndRemoveSpy;

    describe('when the user ID is found', function() {
      beforeEach(async function() {
        // mockingoose doesn't support findByIdAndDelete, so have to workaround
        mockingoose(User).toReturn(mockUserData[0], 'findOneAndDelete');
        User.findByIdAndDelete = jest.fn(User.findOneAndDelete);
        req.params = {_id: "0"}
        await controller.destroy(req, res)
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should call UserModel.findByIdAndDelete", async function() {
        expect(User.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      });
    });

    describe('when the user ID is not found', function() {
      beforeEach(async function() {
        mockingoose(User). toReturn(new Error('error'), 'findByIdAndRemove');
        req.params = {_id: "9999"}
        await controller.destroy(req, res)
      });

      it("should respond with 404 Not Found status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });
    });
  });

  describe("Calling controller.changePassword", function () {

    let user;

    describe("with the correct old password", function() {

      let user;

      beforeEach(async function() {
        req.params = {_id: "0"};
        req.body = {
          oldPassword: "password",
          newPassword: "newPassword"
        };
        user = new User(mockUserData[0]);
        user.encryptPassword = jest.fn((password) => "Encrypted-"+password+"--!");
        user.save = jest.fn().mockReturnValue(new Promise((resolve) => resolve()));
        mockingoose(User).toReturn(user, 'findById');
        mockingoose(User).toReturn(user, 'findOne');

        await controller.changePassword(req, res)
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should save the user", async function() {
        expect(user.save).toHaveBeenCalled();
      });

      it("should change the password on the user", async function() {
        // Note, because we mock the user.save function, we bypass the encryption
        expect(user.password).toEqual(req.body.newPassword);
      });
    });

    describe("with the wrong old password", function() {
      beforeEach(async function() {
        req.params = {_id: "0"};
        req.body = {
          oldPassword: "wrong password",
          newPassword: "newPassword"
        };
        user = new User(mockUserData[0]);
        user.encryptPassword = jest.fn((password) => "Encrypted-"+password+"--!");
        user.save = jest.fn().mockReturnValue(new Promise((resolve) => resolve()));
        mockingoose(User).toReturn(user, 'findById');
        mockingoose(User).toReturn(user, 'findOne');

        await controller.changePassword(req, res)
      });

      it("should respond with 403 Forbidden status", async function() {
        expect(res.status).toHaveBeenCalledWith(403);
      });

      it("should not change the password on the user", async function() {
        expect(user.password).toEqual(mockUserData[0].password);
      });

      it("should not save the user", async function() {
        expect(user.save).not.toHaveBeenCalled();
      });
    });
  });

  describe("Calling controller.me", function () {

    describe("when a user is found", function() {
      beforeEach(async function() {
        req.auth = {_id: "0"};
        mockingoose(User).toReturn(mockUserData[0], 'findOne');
        await controller.me(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of a single user", async function() {
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining(mockUserData[0])
        );
      });
    });

    describe("when a user is not found", function() {
      beforeEach(async function() {
        req.auth = {_id: "9999"};
        mockingoose(User).toReturn(null, 'findOne');
        await controller.me(req, res)
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });

  describe("Calling controller.getNotifications", function () {

    describe("when a user is found", function() {
      beforeEach(async function() {
        req.auth = {_id: "0"};
        mockingoose(User).toReturn(mockUserData[0], 'findOne');
        await controller.getNotifications(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of the user's notification settings", async function() {
        expect(res.json).toHaveBeenCalledWith(mockUserData[0].notificationSettings);
      });
    });

    describe("when a user is not found", function() {
      beforeEach(async function() {
        req.auth = {_id: "9999"};
        mockingoose(User).toReturn(null, 'findOne');
        await controller.getNotifications(req, res)
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });

  });

  describe("Calling controller.saveNotifications", function () {

    let user;

    describe("when a user is found", function() {

      beforeEach(async function() {
        req.auth = {_id: "0"};
        req.body = {a: false};
        user = new User(mockUserData[0]);
        user.save = jest.fn().mockImplementation((saveUser) => new Promise((resolve) => resolve(saveUser)));
        mockingoose(User).toReturn(user, 'findOne');
        await controller.saveNotifications(req, res)
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should save the user", async function() {
        expect(user.save).toHaveBeenCalled()
      });

      it("should change the notification settings on the user", async function() {
        expect(user.notificationSettings).toEqual(req.body);
      });
    });

    describe("when a user is not found", function() {

      beforeEach(async function() {
        req.auth = {_id: "9999"};
        await controller.saveNotifications(req, res)
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it("should not save the user", async function() {
        expect(user.save).not.toHaveBeenCalled()
      });
    });
  });

  describe("Calling controller.verify", function () {

    let user;

    describe("on an unverified user with a valid token", function () {
      beforeEach(async function() {
        req.body = {
          id: "2",
          verificationToken: "test token"
        };
        user = new User(mockUserData[2]);
        user.save = jest.fn().mockImplementation((saveUser) => new Promise((resolve) => resolve(saveUser)));
        mockingoose(User).toReturn(user, 'findById');
        mockingoose(User).toReturn(user, 'findOne');

        expect(user.role).toEqual("unverified");

        await controller.verify(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should save the user", async function() {
        expect(user.save).toHaveBeenCalled()
      });

      it("should update the role of the user", async function() {
        expect(user.role).toEqual("user");
      });
    });

    describe("on an unverified user with an incorrect token", function () {
      beforeEach(async function() {
        req.body = {
          id: "2",
          verificationToken: "wrong token"
        };

        user = new User(mockUserData[2]);
        user.save = jest.fn().mockImplementation((saveUser) => new Promise((resolve) => resolve(saveUser)));
        mockingoose(User).toReturn(user, 'findById');
        mockingoose(User).toReturn(user, 'findOne');

        await controller.verify(req, res)
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it("should not save the user", async function() {
        expect(user.save).not.toHaveBeenCalled()
      });

      it("should not update the role of the user", async function() {
        expect(user.role).toEqual("unverified");
      });
    });

    describe("Verifying an already verified user", function () {
      beforeEach(async function() {
        req.body = {
          id: "1",
        };

        user = new User(mockUserData[1]);
        user.save = jest.fn().mockImplementation((saveUser) => new Promise((resolve) => resolve(saveUser)));
        mockingoose(User).toReturn(user, 'findById');
        mockingoose(User).toReturn(user, 'findOne');

        await controller.verify(req, res)
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it("should not update the role of the user", async function() {
        expect(user.role).toEqual("user");
      });

      it("should not save the user", async function() {
        expect(user.save).not.toHaveBeenCalled()
      });
    });
  });

  describe("Calling controller.sendVerificationEmail", function () {
    beforeEach(async function() {
      req.auth = {_id: "2"};
      mockingoose(User).toReturn(mockUserData[2], 'findOne');
      await controller.sendVerificationEmail(req, res);
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call emailService.send", async function() {
      expect(emailService.send).toHaveBeenCalled();
    });

    it("should use the user's email address", async function() {
      expect(emailService.send.mock.calls[0][0].to).toEqual("Unverified Person <test@example.com>");
    });

    it("should have the correct subject", async function() {
      expect(emailService.send.mock.calls[0][0].subject).toEqual("Please verify your email address");
    });

    it("should contain the user's verification token in the body", async function() {
      expect(emailService.send.mock.calls[0][0].html).toContain(mockUserData[2].verificationToken);
      expect(emailService.send.mock.calls[0][0].text).toContain(mockUserData[2].verificationToken);
    });
  });

  describe("Calling controller.updateHomeProvince", function () {

    let user;

    describe("with a valid home province", function () {

      beforeEach(async function() {
        req.auth = {_id: "0"};
        req.body = {homeProvince: "Gauteng"};

        user = new User(mockUserData[0]);
        user.homeProvince = "WC";
        user.save = jest.fn().mockImplementation((saveUser) => new Promise((resolve) => resolve(saveUser)));

        mockingoose(User).toReturn(user, 'findOne');
        mockingoose(User).toReturn(user, 'findById');

        await controller.updateHomeProvince(req, res);
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should set the user's home province", async function() {
        expect(user.homeProvince).toEqual("GT");
      });

      it("should save the user", async function() {
        expect(user.save).toHaveBeenCalled()
      });
    });

    describe("with an invalid home province", function () {
      beforeEach(async function() {
        req.auth = {_id: "0"};
        req.body = {homeProvince: "Not a province"};

        user = new User(mockUserData[0]);
        user.homeProvince = "WC";
        user.save = jest.fn().mockImplementation((saveUser) => new Promise((resolve) => resolve(saveUser)));

        mockingoose(User).toReturn(user, 'findOne');
        mockingoose(User).toReturn(user, 'findById');

        await controller.updateHomeProvince(req, res);
      });

      it("should respond with 400 Bad Request status", async function() {
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it("should not set the user's home province", async function() {
        expect(user.homeProvince).toEqual("WC");
      });

      it("should not save the user", async function() {
        expect(user.save).not.toHaveBeenCalled()
      });

    });

    describe("if user is not found", function () {
      beforeEach(async function() {
        req.auth = {_id: "0"};
        req.body = {homeProvince: "Gauteng"};

        mockingoose(User).toReturn(null, 'findOne');
        mockingoose(User).toReturn(null, 'findById');

        await controller.updateHomeProvince(req, res);
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });

    describe("with a database error", function () {
      beforeEach(async function() {
        req.auth = {_id: "0"};
        req.body = {homeProvince: "Gauteng"};

        mockingoose(User).toReturn(new Error("Database error"), 'findOne');
        mockingoose(User).toReturn(new Error("Database error"), 'findById');

        await controller.updateHomeProvince(req, res);
      });

      it("should respond with 500 Internal Server Error status", async function() {
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });
});
