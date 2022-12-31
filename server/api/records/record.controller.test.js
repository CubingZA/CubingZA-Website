import {jest} from '@jest/globals';

const mockRecords = [
  {
    "_id":"0",
    "name":"Test Record 1"
  },
  {
    "_id":"0",
    "name":"Another one"
  }];

const getMockRecordModel = () => {
  const model = {_action: undefined, _filter: undefined};
  const reply = (filter)=>{model._action = 'find'; model._filter = filter; return model};
  model.find = jest.fn(reply);
  model.findById = jest.fn(reply);
  model.findOneAndUpdate = jest.fn(reply);
  model.exec = jest.fn(()=>{
    return new Promise((resolve) => {
      switch (model._action) {       
        case 'find':
          resolve(model._filter ? mockRecords[model._filter.eventId] : mockRecords);
          break;
        case 'findById':
          resolve(mockRecords[model._filter.eventId]);
          break;
        case 'findOneAndUpdate':
          resolve(mockRecords[model._filter.eventId]);
          break;
      }
    });
  });
  return model;
}

const getMockRequest = () => ({
  params: {id: 1},
  body: {_id: 0}
});

const getMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

jest.unstable_mockModule('./record.model', function() {
  return {
    default: getMockRecordModel(),
  }
});
const Record = (await import('./record.model')).default;

const controller = (await import('./record.controller'));


describe ("Record controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = getMockRequest();
    res = getMockResponse();
  });

  describe("Calling controller.index", function () {
    beforeEach(async function() {
      await controller.index(req, res)
    });

    it("should respond with 200 status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });   
    
    it("should respond with json containing list of all records", async function() {
      expect(res.json).toHaveBeenCalledWith(mockRecords);
    });
  });

  describe("Calling controller.show", function () {    
    beforeEach(async function() {
      await controller.show(req, res)
    });

    it("should respond with 200 status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single record", async function() {
      expect(res.json).toHaveBeenCalledWith(mockRecords[req.params.id]);
    });
  });

  describe("Calling controller.upsert", function () {
    beforeEach(async function() {
      await controller.upsert(req, res)
    });

    it("should respond with 200 status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single record", async function() {
      expect(res.json).toHaveBeenCalledWith(mockRecords[req.params.id]);
    });
  });
})

