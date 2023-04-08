import {jest} from '@jest/globals';
import { getMockModel, getMockRequest, getMockResponse, mongoose } from '../../test/utils/model.mock';

const mockRecords = [
  {
    "_id":"0",
    "name":"Test Record 1"
  },
  {
    "_id":"1",
    "name":"Another one"
  }];


jest.unstable_mockModule('./record.model', function() {
  return {
    default: getMockModel(mockRecords, "eventId"),
  }
});
const Record = (await import('./record.model')).default;

const controller = (await import('./record.controller'));


describe ("Record controller:", function() {
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

