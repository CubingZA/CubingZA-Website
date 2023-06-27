import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RecordService, ProvincialRecordResponse } from './record.service';

import { Record } from 'src/app/interfaces/record/record';
import { ProvincialRecordTable } from 'src/app/interfaces/record/provincial-record-table';

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

  describe('getNationalRecords', () => {

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

      service.getNationalRecords().subscribe({
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

  describe('getProvincialRecords', () => {

    it('should return the correct records', async () => {
      const mockRecordResponse: ProvincialRecordResponse = {
        "333": {
          "GT": {
            "single": {
              _id: "1",
              userId: "1",
              wcaID: "2345TEST01",
              eventId: "333",
              countryRank: 1,
              best: "1:00:00",
              personName: "Test Person",
              province: "GT",
              provinceRank: 1
            },
            "average": {
              _id: "2",
              userId: "2",
              wcaID: "2345TEST02",
              eventId: "333",
              countryRank: 2,
              best: "1:30:00",
              personName: "Test Person",
              province: "GT",
              provinceRank: 2
            }
          },
          "WC": {
            "single": {
              _id: "3",
              userId: "3",
              wcaID: "2345TEST03",
              eventId: "333",
              countryRank: 3,
              best: "1:00:00",
              personName: "Test Person",
              province: "WC",
              provinceRank: 1
            }
          }
        }
      };

      const mockProvincialRecords: ProvincialRecordTable = {
        "333": [
          {
            eventName: "3x3x3 Cube",
            eventId: "333",
            singleName: "Test Person",
            singleResult: "1:00:00",
            singleId: "2345TEST01",
            singleNR: true,
            averageName: "Test Person",
            averageResult: "1:30:00",
            averageId: "2345TEST02",
            averageNR: false,
            province: "GT"
          },
          {
            eventName: "3x3x3 Cube",
            eventId: "333",
            singleName: "Test Person",
            singleResult: "1:00:00",
            singleId: "2345TEST03",
            singleNR: false,
            averageName: "",
            averageResult: "",
            averageId: "",
            averageNR: false,
            province: "WC"
          }
        ]
      }

      service.getProvincialRecords().subscribe({
        next: records => {
          expect(records).toEqual(mockProvincialRecords);
        },
        error: err => {
          fail(err);
        }
      });

      const req = httpMock.expectOne('/api/rankings/records');
      expect(req.request.method).toEqual('GET');
      req.flush(mockRecordResponse);


    });
  });
});
