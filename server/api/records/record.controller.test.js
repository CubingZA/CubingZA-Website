import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import { getMockRequest, getMockResponse } from '../../test/utils/model.mock';

const Record = (await import('./record.model')).default;
const controller = (await import('./record.controller'));

const mockRecordData = [
  {
    eventName: "3x3x3 Cube",
    eventId: "333",
    singleName: "John Doe",
    singleResult: "1:00:00",
    singleId: "1",
    averageName: "John Doe",
    averageResult: "1:30:00",
    averageId: "1",
    eventRank: 1
  },
  {
    eventName: "Skewb",
    eventId: "skewb",
    singleName: "Bob Person",
    singleResult: "0:30:00",
    singleId: "2",
    averageName: "Someone Else",
    averageResult: "0:40:00",
    averageId: "3",
    eventRank: 2
  }
];


describe ("Record controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = getMockRequest();
    res = getMockResponse();
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

