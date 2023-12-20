import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';


const Record = (await import('./record.model.js')).default;
const controller = (await import('./record.controller.js'));

const mockRecordData = [
  {
    eventName: "3x3x3 Cube",
    eventId: "333",
    eventRank: 1,
    singleResult: "1:00:00",
    singleName: ["John Doe"],
    singleId: ["1"],
    averageResult: "1:30:00",
    averageName: ["John Doe"],
    averageId: ["1"],
  },
  {
    eventName: "Skewb",
    eventId: "skewb",
    eventRank: 2,
    singleResult: "0:30:00",
    singleName: ["Bob Person"],
    singleId: ["2"],
    averageResult: "0:40:00",
    averageName: ["Someone Else"],
    averageId: ["3"],
  }
];


describe ("Record controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = new Request();
    req.setBody({});
    res = new Response();
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe("Calling controller.index", function () {

    it('should return a list of all users', async function() {
      mockingoose(Record).toReturn(mockRecordData, 'find');
      await controller.index({}, res);

      expect(res.status).toHaveBeenCalledWith(200);

      mockRecordData.forEach(record => {
        expect(res.json).toHaveBeenCalledWith(
          expect.arrayContaining([expect.objectContaining(record)])
        );
      });
    });

    it('should handle errors correctly', async () => {
      const dbError = new Error('Database error');
      mockingoose(Record).toReturn(dbError, 'find');
      await controller.index({}, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.send).toHaveBeenCalledWith(dbError);
    });
  });

  describe("Calling controller.show", function () {

    describe("when the record is found", function () {

      beforeEach(async function() {
        req.params.id = "1"
        mockingoose(Record).toReturn(mockRecordData[0], 'find');
        await controller.show(req, res)
      });

      it("should respond with 200 status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of a single record", async function() {
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining(mockRecordData[0])
        );
      });
    });

    describe("when the record is not found", function () {
      beforeEach(async function() {
        req.params.id = "3"
        mockingoose(Record).toReturn(null, 'find');
        await controller.show(req, res)
      });

      it("should respond with 404 status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it("should not respond with any json", async function() {
        expect(res.end).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
    });
  });

  describe("Calling controller.upsert", function () {

    describe("when the record is found", function () {

      beforeEach(async function() {
        req.params.id = "1"
        mockingoose(Record).toReturn(mockRecordData[0], 'findOneAndUpdate');
        await controller.upsert(req, res)
      });

      it("should respond with 200 status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json of a single record", async function() {
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining(mockRecordData[0])
        );
      });
    });

    describe("when the record is not found", function () {
      beforeEach(async function() {
        req.params.id = "3"
        mockingoose(Record).toReturn(null, 'findOneAndUpdate');
        await controller.upsert(req, res)
      });

      it("should respond with 404 status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it("should not respond with any json", async function() {
        expect(res.end).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
    });
  });
})

