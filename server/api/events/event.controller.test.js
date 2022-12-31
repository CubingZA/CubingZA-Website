import {jest} from '@jest/globals';

jest.mock('mongoose');
const mongoose = (await import('mongoose'));

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
  }];

const getMockEventModel = () => {
  const model = mongoose.Model;
  const query = mongoose.Query;
  const document = mongoose.Document;
  
  query._filter = undefined;

  const makeReplyWithWithQuery = type => (filter)=>{
    query._filter = (type==='id' || !filter) ?
      filter :
      filter._id;
    return query
  };
  model.find = jest.fn(makeReplyWithWithQuery());
  model.findById = jest.fn(makeReplyWithWithQuery('id'));
  model.findOneAndUpdate = jest.fn(makeReplyWithWithQuery());

  const makeFunReturningPromiseResolvingToDoc = () => jest.fn(()=>{
    return new Promise(resolve => {
      document.data = query._filter ? 
        mockEvents.filter((item) => item.eventId === query._filter)[0] : 
        mockEvents
      resolve(document);
    });
  });

  query.exec = makeFunReturningPromiseResolvingToDoc();

  model.create = makeFunReturningPromiseResolvingToDoc();
  model.remove = makeFunReturningPromiseResolvingToDoc();

  document.save = makeFunReturningPromiseResolvingToDoc();
  document.remove = makeFunReturningPromiseResolvingToDoc();
  return model;
}

const getMockRequest = () => ({
  params: {id: "1"},
  body: {_id: "0"}
});

const getMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

jest.unstable_mockModule('./event.model', function() {
  return {
    default: getMockEventModel(),
  }
});
const EventModel = (await import('./event.model')).default;


const controller = await import('./event.controller');


describe ("Event controller:", function() {
  let req;
  let res;

  beforeEach(async function() {    
    req = getMockRequest();
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
      expect(res.json).toHaveBeenCalledWith(mongoose.Document);
      expect(mongoose.Document.data).toEqual(mockEvents);
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
      expect(res.json).toHaveBeenCalledWith(mongoose.Document);
      expect(mongoose.Document.data).toEqual(mockEvents[req.params.id]);
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
      expect(res.json).toHaveBeenCalledWith(mongoose.Document);
      expect(mongoose.Document.data).toEqual(mockEvents[req.params.id]);
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

    it("should notification emails with the competition that was recieved", async function() {
      expect(sendNotificationEmails).toHaveBeenCalledWith(mongoose.Document);
    }); 

  });
})
