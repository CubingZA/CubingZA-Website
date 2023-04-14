import {jest} from '@jest/globals';
import { getMockModel, getMockRequest, getMockResponse, mongoose } from '../../test/utils/model.mock';

// Mock Email service
jest.unstable_mockModule('../../services/email/email.service', function() {
  return {
    send: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
    validate: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
  }
});
const emailService = (await import('../../services/email/email.service'));

const mockUsers = [
  {
    "_id":"0",
    "name":"Test Item 1",
    "notificationSettings": {a:true}
  },
  {
    "_id":"1",
    "name":"Another one",
    "role": "user"
  },
  {
    "_id":"2",
    "name":"Unverified Person",
    "email": "test@example.com",
    "role": "unverified",
    "verificationToken": "test token"
  }
];

const authFn = jest.fn();

jest.unstable_mockModule('./user.model', function() {
  return {
    default: getMockModel(mockUsers, '_id', {
      authenticate: authFn
    }),
  }
});

const UserModel = (await import('./user.model')).default;
const controller = await import('./user.controller');


describe ("User controller:", function() {
  let req;
  let res;

  beforeEach(async function() {    
    req = getMockRequest();
    res = getMockResponse();
    UserModel.setMockItems(mockUsers.map((user) => {return {...user}}));
    jest.clearAllMocks();
  });

  describe("Calling controller.index", function () {
    beforeEach(async function() {
      await controller.index(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });   
    
    it("should respond with json containing list of all users", async function() {
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]._rawResult).toEqual(mockUsers);

    });
  });
  
  describe("Calling controller.show", function () { 
    
    describe("when a user is found", function() {
      beforeEach(async function() {
        req.params = {id: "0"}
        await controller.show(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of a single user", async function() {
        expect(res.json).toHaveBeenCalled();
        expect(res.json.mock.calls[0][0]._rawResult).toEqual(mockUsers[0]);
      });
    });

    describe("when a user is not found", function() {
      beforeEach(async function() {
        req.params = {id: "9999"}
        await controller.show(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });
    });
  });

  describe("Calling controller.create", function () {
    beforeEach(async function() {
      req.body = {_id: "0", name: "Test person"}
      await controller.create(req, res)
    });

    it("should respond with 201 Created status", async function() {
      expect(res.status).toHaveBeenCalledWith(201);
    });   
    
    it("should instantiate a new UserModel method with the request body", async function() {
      expect(UserModel).toHaveBeenCalledWith(req.body);
    });
    it("should save the user", async function() {
      expect(UserModel.mock.instances[0].save).toHaveBeenCalled()
    });
    it("should respond with JSON", async function() {
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("Calling controller.destroy", function () {
    beforeEach(async function() {
      req.params = {_id: "0"}
      await controller.destroy(req, res)
    });

    it("should respond with 204 No Content status", async function() {
      expect(res.status).toHaveBeenCalledWith(204);
    });   
    
    it("should call UserModel.findByIdAndRemove", async function() {
      expect(UserModel.findByIdAndRemove).toHaveBeenCalledWith(req.params.id);
    });
  });

  describe("Calling controller.changePassword", function () {

    describe("with the correct old password", function() {

      beforeEach(async function() {
        req.params = {_id: "0"};
        req.body = {
          oldPassword: "oldPassword",
          newPassword: "newPassword"
        };
        authFn.mockReturnValue(true);
        await controller.changePassword(req, res)
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should call UserModel.findById", async function() {
        expect(UserModel.findById).toHaveBeenCalledWith(req.params.id);
      });

      it("should authenticate the user", async function() {
        expect(authFn).toHaveBeenCalledWith(req.body.oldPassword);
      });

      it("should save the user", async function() {
        expect(mongoose.Document.save).toHaveBeenCalled()
      });

      it("should change the password on the user", async function() {
        expect(mongoose.Document.data.password).toEqual(req.body.newPassword);
      });
    });

    describe("with the wrong old password", function() {
      beforeEach(async function() {
        req.params = {_id: "0"};
        req.body = {
          oldPassword: "oldPassword",
          newPassword: "newPassword"
        };
        authFn.mockReturnValue(false);
        await controller.changePassword(req, res)
      });

      it("should respond with 403 Forbidden status", async function() {
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });
  });

  describe("Calling controller.me", function () {

    describe("when a user is found", function() {
      beforeEach(async function() {
        req.auth = {_id: "0"};
        await controller.me(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });   
      
      it("should respond with json of a single user", async function() {
        expect(res.json).toHaveBeenCalled();
        expect(res.json.mock.calls[0][0]._rawResult).toEqual(mockUsers[0]);
      });
    }); 

    describe("when a user is not found", function() {
      beforeEach(async function() {
        req.auth = {_id: "9999"};
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
        await controller.getNotifications(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of the user's notification settings", async function() {
        expect(res.json).toHaveBeenCalledWith(mockUsers[0].notificationSettings);
      });
    });

    describe("when a user is not found", function() {
      beforeEach(async function() {
        req.auth = {_id: "9999"};
        await controller.getNotifications(req, res)
      });

      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });

  });

  describe("Calling controller.saveNotifications", function () {

    describe("when a user is found", function() {

      beforeEach(async function() {
        req.auth = {_id: "0"};
        req.body = {a: false};
        await controller.saveNotifications(req, res)
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should call UserModel.findById", async function() {
        expect(UserModel.findById).toHaveBeenCalledWith(req.auth._id);
      });

      it("should save the user", async function() {
        expect(mongoose.Document.save).toHaveBeenCalled()
      });

      it("should change the notification settings on the user", async function() {
        expect(mongoose.Document.data.notificationSettings).toEqual(req.body);
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
    });
  });

  describe("Calling controller.verify", function () {
    
    describe("Verifying an unverified user with a valid token", function () {
      beforeEach(async function() {
        req.body = {
          id: "2",
          verificationToken: "test token"
        };
        await controller.verify(req, res)
      });
    
      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });
      
      it("should call UserModel.findById", async function() {
        expect(UserModel.findById).toHaveBeenCalledWith(req.body.id);
      });
      
      it("should update the role of the user", async function() {
        expect(mongoose.Document.data.role).toEqual("user");
      });
    });

    describe("Verifying an unverified user with an incorrect token", function () {
      beforeEach(async function() {
        req.body = {
          id: "2",
          verificationToken: "wrong token"
        };
        await controller.verify(req, res)
      });
      
      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });
      
      it("should not update the role of the user", async function() {
        expect(mongoose.Document.data.role).toEqual("unverified");
      });
    });
    
    describe("Verifying an already verified user", function () {
      beforeEach(async function() {
        req.body = {
          id: "1",
        };
        await controller.verify(req, res)
      });
      
      it("should respond with 401 Unauthorized status", async function() {
        expect(res.status).toHaveBeenCalledWith(401);
      });
      
      it("should not update the role of the user", async function() {
        expect(mongoose.Document.data.role).toEqual("user");
      });
    });
  });

  describe("Calling controller.sendVerificationEmail", function () {
    beforeEach(async function() {
      req.auth = {_id: "2"};
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
      expect(emailService.send.mock.calls[0][0].html).toContain(mockUsers[2].verificationToken);
      expect(emailService.send.mock.calls[0][0].text).toContain(mockUsers[2].verificationToken);
    });
  });
  
});
