import {jest} from '@jest/globals';

jest.mock('mongoose');
const mongoose = (await import('mongoose'));

const mockClient = {
  messages: {
    create: jest.fn(()=>{
      return new Promise(resolve=>{resolve()});
    })
  }
};
jest.mock('mailgun.js', function() {  
  return jest.fn(()=>({
    client: jest.fn(()=>mockClient)
  }))
});
const Mailgun = (await import('mailgun.js')).default;

const mockItems = [
  {
    "_id":"0",
    "name":"Test Item 1"
  },
  {
    "_id":"1",
    "name":"Another one"
  }
];

const getMockModel = () => {
  const Model = mongoose.Model;
  const query = mongoose.Query;
  const document = mongoose.Document;
  
  let currentModel = {};

  query._filter = undefined;

  const makeReplyWithWithQuery = type => (filter)=>{
    query._filter = (type==='id' || !filter) ?
      filter :
      filter._id;
    return query
  };

  Model.find = jest.fn(makeReplyWithWithQuery());
  Model.findById = jest.fn(makeReplyWithWithQuery('id'));
  Model.findOneAndUpdate = jest.fn(makeReplyWithWithQuery());

  const makeFunToFilterAndPromiseDoc = () => jest.fn(()=>{
    return new Promise(resolve => {
      document.data = query._filter ? 
        mockItems.filter((item) => item._id === query._filter)[0] : 
        mockItems
      document.profile = document.data;

      resolve(document);
    });
  });

  const makeFunToPromiseCurrentModel = () => jest.fn(()=>{
    return new Promise(resolve => {
      resolve(currentModel);
    });
  });

  query.exec = makeFunToFilterAndPromiseDoc();

  Model.create = makeFunToFilterAndPromiseDoc();
  Model.remove = makeFunToFilterAndPromiseDoc();  
  jest.spyOn(Model.prototype, 'constructor')
    .mockImplementation(function (data) {
      Object.assign(this, data);
      return this;
    });
  jest.spyOn(Model.prototype, 'save')
    .mockImplementation(makeFunToPromiseCurrentModel());

  document.save = makeFunToFilterAndPromiseDoc();
  document.remove = makeFunToFilterAndPromiseDoc();

  return Model;
}

const getMockRequest = () => ({
  params: {},
  auth: {},
  body: {}
});

const getMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

jest.unstable_mockModule('./user.model', function() {
  return {
    default: getMockModel(),
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
      expect(res.json).toHaveBeenCalledWith(mongoose.Document);
      expect(mongoose.Document.data).toEqual(mockItems);
    });
  });
  
  describe("Calling controller.show", function () {    
    beforeEach(async function() {
      req.params = {id: "0"}
      mongoose.Document.profile = mockItems[req.params.id];
      await controller.show(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single user", async function() {
      expect(res.json).toHaveBeenCalledWith(mongoose.Document.profile);
      expect(mongoose.Document.profile).toEqual(mockItems[req.params.id]);
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
    
    it("should call the model's create method with the request body", async function() {
      expect(EventModel.create).toHaveBeenCalledWith(req.body);
    });
  });
  
  describe("Calling controller.send", function () {
    beforeEach(async function() {
      await controller.send(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with a success flag that is set to true", async function() {
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0].success).toBe(true);
    });   
    
    it("should respond with json containing list of all events", async function() {
      const expectedMessage = {
        from: 'Sender <sender@example.com>', 
        to: 'info@your-mailgun-domain', 
        subject: 'Subject', 
        text: 'Test Message'
      };
      expect(mockClient.messages.create).toHaveBeenCalledWith(
        process.env.MAILGUN_DOMAIN,
        expectedMessage
      );
    });
  });
})
