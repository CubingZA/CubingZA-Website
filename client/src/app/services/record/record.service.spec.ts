import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Record, RecordService } from './record.service';

describe('RecordService', () => {
  let service: RecordService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getRecords', () => {

    it('should return the correct records', async () => {
      const mockRecordData: Record[] = [
        {
          eventName: "3x3x3 Cube",
          eventId: "333",
          singleName: "John Doe",
          singleResult: "1:00:00",
          singleId: "1",
          averageName: "John Doe",
          averageResult: "1:30:00",
          averageId: "1",
          eventRank: 1,
          singleDate: new Date(),
          averageDate: new Date()
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
          eventRank: 2,
          singleDate: new Date(),
          averageDate: new Date()
        }
      ];

      service.getRecords().subscribe({
        next: records => {
          expect(records).toEqual(mockRecordData);
        },
        error: err => {
          fail(err);
        }
      });

      const req = httpMock.expectOne('/api/records');
      expect(req.request.method).toEqual('GET');
      req.flush(mockRecordData);
    });
  });
});
