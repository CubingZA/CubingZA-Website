import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProvincialRankingsService, Ranking } from './provincial-rankings.service';

const mockSingleRankingData: Ranking[] = [
  {
    _id: '1',
    userId: '1',
    eventId: '333',
    wcaID: '2000ABCD01',
    personName: 'Test Person',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '1.00'
  },
  {
    _id: '2',
    userId: '2',
    eventId: '333',
    wcaID: '2000ABCD02',
    personName: 'Someone Else',
    countryRank: 2,
    province: 'GT',
    provinceRank: 2,
    best: '2.00'
  }
];

const mockAverageRankingData: Ranking[] = [
  {
    _id: '3',
    userId: '3',
    eventId: '333',
    wcaID: '2000WXYZ01',
    personName: 'Test Person',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '3.00'
  },
  {
    _id: '4',
    userId: '4',
    eventId: '333',
    wcaID: '2001WXYZ02',
    personName: 'Yet Another Person',
    countryRank: 5,
    province: 'WC',
    provinceRank: 3,
    best: '4.00'
  }
];

describe('RankingsService', () => {
  let service: ProvincialRankingsService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProvincialRankingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getRankings', () => {

    it('should return single data from the API>', async () => {
      service.getRankings('333', 'GT', 'single').subscribe((rankings) => {
        expect(rankings.length).toBe(2);
        expect(rankings).toEqual(mockSingleRankingData);
      });

      const req = httpMock.expectOne('/api/rankings/GT/333/single');
      expect(req.request.method).toEqual('GET');
      req.flush(mockSingleRankingData);
    });

    it('should return average data from the API>', async () => {
      service.getRankings('666', 'WC', 'average').subscribe((rankings) => {
        expect(rankings.length).toBe(2);
        expect(rankings).toEqual(mockAverageRankingData);
      });

      const req = httpMock.expectOne('/api/rankings/WC/666/average');
      expect(req.request.method).toEqual('GET');
      req.flush(mockAverageRankingData);
    });

    it('should handle paging', async () => {
      service.getRankings('333', 'GT', 'single', 3).subscribe((rankings) => {
        expect(rankings.length).toBe(2);
        expect(rankings).toEqual(mockSingleRankingData);
      });

      const req = httpMock.expectOne('/api/rankings/GT/333/single?page=3');
      expect(req.request.method).toEqual('GET');
      req.flush(mockSingleRankingData);
    });
  });

  describe('getRankingsCount', () => {
    it('should return single data from the API>', async () => {
      service.getRankingsCount('333', 'GT', 'single').subscribe((count) => {
        expect(count).toEqual(2);
      });

      const req = httpMock.expectOne('/api/rankings/GT/333/single/count');
      expect(req.request.method).toEqual('GET');
      req.flush(2);
    });

    it('should return average data from the API>', async () => {
      service.getRankingsCount('666', 'WC', 'average').subscribe((count) => {
        expect(count).toEqual(2);
      });

      const req = httpMock.expectOne('/api/rankings/WC/666/average/count');
      expect(req.request.method).toEqual('GET');
      req.flush(2);
    });
  });

  describe('cancelling requests', () => {

    describe('cancelPendingRankingRequests', () => {

      it('should cancel pending Rankings requests', async () => {
        service.getRankings('333', 'GT', 'single').subscribe({
          next:(rankings) => fail('request should have been cancelled')
        });

        service.cancelPendingRankingRequests();

        const req = httpMock.expectOne('/api/rankings/GT/333/single');
        expect(req.request.method).toEqual('GET');

        expect(() => req.flush(mockSingleRankingData)).toThrowError('Cannot flush a cancelled request.');
      });

      it('should not cancel pending count requests', async () => {
        service.getRankingsCount('333', 'GT', 'single').subscribe((count) => {
          expect(count).toEqual(2);
        });

        service.cancelPendingRankingRequests();

        const req = httpMock.expectOne('/api/rankings/GT/333/single/count');
        expect(req.request.method).toEqual('GET');
        req.flush(2);
      });
    });

    describe('cancelPendingCountRequests', () => {
      it('should cancel pending count requests', async () => {
        service.getRankingsCount('333', 'GT', 'single').subscribe({
          next:(count) => fail('request should have been cancelled')
        });

        service.cancelPendingCountRequests();

        const req = httpMock.expectOne('/api/rankings/GT/333/single/count');
        expect(req.request.method).toEqual('GET');

        expect(() => req.flush(2)).toThrowError('Cannot flush a cancelled request.');
      });

      it('should not cancel pending Rankings requests', async () => {
        service.getRankings('333', 'GT', 'single').subscribe((rankings) => {
          expect(rankings.length).toBe(2);
          expect(rankings).toEqual(mockSingleRankingData);
        });

        service.cancelPendingCountRequests();

        const req = httpMock.expectOne('/api/rankings/GT/333/single');
        expect(req.request.method).toEqual('GET');
        req.flush(mockSingleRankingData);
      });
    });
  });
});
