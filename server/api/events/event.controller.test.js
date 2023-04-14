import {jest} from '@jest/globals';
import { getMockModel, getMockRequest, getMockResponse, mongoose } from '../../test/utils/model.mock';

jest.unstable_mockModule('../../components/notificationEmailer/notificationEmailer', ()=>({
  default: jest.fn(()=>{})
}));
const sendNotificationEmails = (await import('../../components/notificationEmailer/notificationEmailer')).default;

const mockEvents = [
  {
    "_id":"0",
    "eventId": "0",
    "name":"Test Item 1"
  },
  {
    "_id":"1",
    "eventId": "1",
    "name":"Another one"
  }
];

jest.unstable_mockModule('./event.model', function() {
  return {
    default: getMockModel(mockEvents),
  }
});
const EventModel = (await import('./event.model')).default;

const controller = await import('./event.controller');


describe ("Event controller:", function() {
  let req;
  let res;

  beforeEach(async function() {    
    req = getMockRequest({id: "1"}, {_id: "0"});
    res = getMockResponse();
    jest.clearAllMocks();
  });

  describe("Calling controller.index", function () {
    beforeEach(async function() {
      await controller.index(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });   
    
    it("should respond with json containing list of all events", async function() {
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });
  });

  describe("Calling controller.show", function () {    
    beforeEach(async function() {
      await controller.show(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single event", async function() {
      expect(res.json).toHaveBeenCalledWith(mockEvents[req.params.id]);
    });
  });

  describe("Calling controller.upsert", function () {
    beforeEach(async function() {
      await controller.upsert(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single event", async function() {
      expect(res.json).toHaveBeenCalledWith(mockEvents[req.params.id]);
    });
  });
  
  describe("Calling controller.create", function () {
    beforeEach(async function() {
      await controller.create(req, res)
    });

    it("should respond with 201 Created status", async function() {
      expect(res.status).toHaveBeenCalledWith(201);
    });   
    
    it("should call the model's create method with the request body", async function() {
      expect(EventModel.create).toHaveBeenCalledWith(req.body);
    });
  });
  
  describe("Calling controller.destroy with no params", function () {
    beforeEach(async function() {
      delete req.params.id;
      await controller.destroy(req, res)
    });

    it("should respond with 204 No Content status", async function() {
      expect(res.status).toHaveBeenCalledWith(204);
    });   
    
    it("should have all events in the document and then call remove", async function() {
      expect(mongoose.Document.data).toEqual(mockEvents);
      expect(mongoose.Document.remove).toHaveBeenCalledWith();
    });

    it("should end the response with no data", async function() {
      expect(res.end).toHaveBeenCalledWith();
    });
  });

  describe("Calling controller.destroy with an id in the request params", function () {
    beforeEach(async function() {
      await controller.destroy(req, res)
    });

    it("should respond with 204 No Content status", async function() {
      expect(res.status).toHaveBeenCalledWith(204);
    });   
    
    it("should have only the specified event in the document and then call remove", async function() {
      expect(mongoose.Document.data).toEqual(mockEvents[req.params.id]);
      expect(mongoose.Document.remove).toHaveBeenCalledWith();
    });

    it("should end the response with no data", async function() {
      expect(res.end).toHaveBeenCalledWith();
    });
  });

  describe("Calling controller.sendNotifications", function () {
    beforeEach(async function() {
      await controller.sendNotifications(req, res)
    });

    it("should respond with 200 OK status and success message", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({message: 'success'});
    }); 

    it("should use only the specified competition ", async function() {
      expect(mongoose.Document.data).toEqual(mockEvents[req.params.id]);
    }); 

    it("should send notification emails for the competition", async function() {
      expect(sendNotificationEmails).toHaveBeenCalled();
    }); 

  });
})
