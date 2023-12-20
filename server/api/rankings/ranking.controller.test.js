import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';


const Ranking = (await import('./ranking.model.js')).default;
const controller = (await import('./ranking.controller.js'));

const mockSingleRankingData = [
  {
    eventId: '333',
    wcaID: '2000ABCD01',
    personName: 'Test Person',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '1.00'
  },
  {
    eventId: '333',
    wcaID: '2000ABCD02',
    personName: 'Someone Else',
    countryRank: 2,
    province: 'GT',
    provinceRank: 2,
    best: '2.00'
  }
];

const mockSingleRankingDataWithTie = [
  {
    eventId: '333',
    wcaID: '2000ABCD01',
    personName: 'Test Person',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '1.00'
  },
  {
    eventId: '333',
    wcaID: '2000ABCD02',
    personName: 'Someone Else',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '1.00'
  }
]

const mockAverageRankingData = [
  {
    eventId: '333',
    wcaID: '2000WXYZ01',
    personName: 'Test Person',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '3.00'
  },
  {
    eventId: '333',
    wcaID: '2001WXYZ02',
    personName: 'Yet ANother Person',
    countryRank: 5,
    province: 'WC',
    provinceRank: 3,
    best: '4.00'
  }
];

describe ("Ranking controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = new Request();
    req.setBody({});
    res = new Response();
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe("Calling controller.getSingleRankings", function () {

    let findSingleSpy;

    describe("with no paging parameters", function() {
      beforeEach(async function() {
        mockingoose(Ranking.Single).toReturn(mockSingleRankingData, 'find');
        mockingoose(Ranking.Average).toReturn(mockAverageRankingData, 'find');

        findSingleSpy = jest.spyOn(Ranking.Single, 'find');

        req.setParams({
          province: 'GT',
          event: '333',
        });
        await controller.getSingleRankings(req, res);
      });

      it('should respond with 200 OK', async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with single rankings', async function() {
        mockSingleRankingData.forEach(ranking => {
          expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([expect.objectContaining(ranking)])
          );
        });
      });

      it('should default to requesting the first 100 items', async function() {
        expect(findSingleSpy).toHaveBeenCalledWith(
          expect.objectContaining({'provinceRank': {'$gt': 0, '$lte': 100}}),
          expect.any(String)
        );
      });

      it('should not include the userId field', async function() {
        expect(findSingleSpy).toHaveBeenCalledWith(
          expect.anything(),
          "-userId"
        );
      });
    });

    describe("with paging parameters", function() {
      beforeEach(async function() {
        mockingoose(Ranking.Single).toReturn(mockSingleRankingData, 'find');
        mockingoose(Ranking.Average).toReturn(mockAverageRankingData, 'find');

        findSingleSpy = jest.spyOn(Ranking.Single, 'find');

        req.setParams({
          province: 'GT',
          event: '333',
        });
        req.setQuery({
          page: 2,
          pagesize: 10
        });
        await controller.getSingleRankings(req, res);
      });

      it('should request the second page of 10 items', async function() {
        expect(findSingleSpy).toHaveBeenCalledWith(
          expect.objectContaining({'provinceRank': {'$gt': 10, '$lte': 20}}),
          expect.any(String)
        );
      });
    });

    describe("with a page size greater than 100", function() {
      beforeEach(async function() {
        mockingoose(Ranking.Single).toReturn(mockSingleRankingData, 'find');
        mockingoose(Ranking.Average).toReturn(mockAverageRankingData, 'find');

        findSingleSpy = jest.spyOn(Ranking.Single, 'find');

        req.setParams({
          province: 'GT',
          event: '333',
        });
        req.setQuery({
          page: 2,
          pagesize: 101
        });
        await controller.getSingleRankings(req, res);
      });

      it('should respond with 400 Bad Request', async function() {
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should respond with an error message', async function() {
        expect(res.send).toHaveBeenCalledWith('Maximum pagesize is 100');
      });
    });

    describe("with a database error", function() {
      beforeEach(async function() {
        mockingoose(Ranking.Single).toReturn(new Error('Database error'), 'find');

        req.setParams({
          province: 'GT',
          event: '333',
        });
        await controller.getSingleRankings(req, res);
      });

      it('should respond with 500 Internal Server Error', async function() {
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it('should respond with an error message', async function() {
        expect(res.send).toHaveBeenCalledWith(
          expect.objectContaining({message: 'Database error'})
        );
      });
    });
  });

  describe("Calling controller.getAverageRankings", function () {
    beforeEach(async function() {
      mockingoose(Ranking.Single).toReturn(mockSingleRankingData, 'find');
      mockingoose(Ranking.Average).toReturn(mockAverageRankingData, 'find');

      req.setParams({
        province: 'GT',
        event: '333',
      });
      await controller.getAverageRankings(req, res);
    });

    it('should respond with 200 OK', async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should respond with average rankings', async function() {
      mockAverageRankingData.forEach(ranking => {
        expect(res.json).toHaveBeenCalledWith(
          expect.arrayContaining([expect.objectContaining(ranking)])
        );
      });
    });
  });

  describe('Calling count endpoints', function () {
    beforeEach(async function() {
      mockingoose(Ranking.Single).toReturn(5, 'countDocuments');
      mockingoose(Ranking.Average).toReturn(8, 'countDocuments');

      req.setParams({
        province: 'GT',
        event: '333',
      });
    });

    describe('controller.getSingleCount', function () {
      beforeEach(async function() {
        await controller.getSingleCount(req, res);
      });

      it('should respond with 200 OK', async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with the count', async function() {
        expect(res.json).toHaveBeenCalledWith(5);
      });
    });

    describe('controller.getAverageCount', function () {
      beforeEach(async function() {
        await controller.getAverageCount(req, res);
      });

      it('should respond with 200 OK', async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with the count', async function() {
        expect(res.json).toHaveBeenCalledWith(8);
      });
    });
  });

  describe('Calling count endpoints when the count is zero', function () {
    beforeEach(async function() {
      mockingoose(Ranking.Single).toReturn(0, 'countDocuments');
      mockingoose(Ranking.Average).toReturn(0, 'countDocuments');

      req.setParams({
        province: 'GT',
        event: '333',
      });
    });

    describe('controller.getSingleCount', function () {
      beforeEach(async function() {
        await controller.getSingleCount(req, res);
      });

      it('should respond with 200 OK', async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with the count', async function() {
        expect(res.json).toHaveBeenCalledWith(0);
      });
    });

    describe('controller.getAverageCount', function () {
      beforeEach(async function() {
        await controller.getAverageCount(req, res);
      });

      it('should respond with 200 OK', async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with the count', async function() {
        expect(res.json).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Calling controller.getProvincialRecords', function () {

    describe('without a tie', function () {
      beforeEach(async function() {
        mockingoose(Ranking.Single).toReturn([mockSingleRankingData[0]], 'find');
        mockingoose(Ranking.Average).toReturn([mockAverageRankingData[0]], 'find');
      });

      it('should respond with 200 OK', async function() {
        await controller.getProvincialRecords(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with provincial records', async function() {
        await controller.getProvincialRecords(req, res);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            '333': expect.objectContaining({
              'GT': expect.objectContaining({
                single: expect.arrayContaining([expect.objectContaining(mockSingleRankingData[0])]),
                average: expect.arrayContaining([expect.objectContaining(mockAverageRankingData[0])]),
              })
            })
          })
        );
      });
    });

    describe('with a tie', function () {
      beforeEach(async function() {
        mockingoose(Ranking.Single).toReturn(mockSingleRankingDataWithTie, 'find');
        mockingoose(Ranking.Average).toReturn([mockAverageRankingData[0]], 'find');
      });

      it('should respond with 200 OK', async function() {
        await controller.getProvincialRecords(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should respond with provincial records', async function() {
        await controller.getProvincialRecords(req, res);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            '333': expect.objectContaining({
              'GT': expect.objectContaining({
                single: expect.arrayContaining([
                  expect.objectContaining(mockSingleRankingDataWithTie[0]),
                  expect.objectContaining(mockSingleRankingDataWithTie[1])
                ]),
                average: expect.arrayContaining([expect.objectContaining(mockAverageRankingData[0])]),
              })
            })
          })
        );
      });
    });
  });

});

