import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CompetitionService } from './competition.service';

import { Competition } from 'src/app/interfaces/competition/competition';

describe('CompetitionService', () => {
  let service: CompetitionService;
  let httpMock: HttpTestingController;
  let mockDate = new Date(2021, 1, 1);

  const mockCompetition: Competition = {
    _id: '1',
    name: 'Competition 1',
    registrationName: 'Competition 1',
    venue: 'Venue 1',
    address: 'Address 1',
    city: 'City 1',
    province: 'Province 1',
    startDate: new Date(2021, 1, 1),
    endDate: new Date(2021, 1, 1)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CompetitionService);
    httpMock = TestBed.inject(HttpTestingController);

    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('getBlankCompetition', () => {

    it('should return a blank competition', () => {
      const blankCompetition: Competition = {
        _id: '',
        name: '',
        registrationName: '',
        venue: '',
        address: '',
        city: '',
        province: '',
        startDate: mockDate,
        endDate: mockDate
      };

      expect(service.getBlankCompetition()).toEqual(blankCompetition);
    });
  });

  describe('getUpcomingCompetitions', () => {

    it('should return the correct competitions', (done) => {
      const mockCompetitions: Competition[] = [
        {
          _id: '1',
          name: 'Competition 1',
          registrationName: 'Competition 1',
          venue: 'Venue 1',
          address: 'Address 1',
          city: 'City 1',
          province: 'Province 1',
          startDate: new Date(2021, 1, 1),
          endDate: new Date(2021, 1, 1)
        },
        {
          _id: '2',
          name: 'Competition 2',
          registrationName: 'Competition 2',
          venue: 'Venue 2',
          address: 'Address 2',
          city: 'City 2',
          province: 'Province 2',
          startDate: new Date(2021, 1, 1),
          endDate: new Date(2021, 1, 1)
        },
        {
          _id: '3',
          name: 'Competition 3',
          registrationName: 'Competition 3',
          venue: 'Venue 3',
          address: 'Address 3',
          city: 'City 3',
          province: 'Province 3',
          startDate: new Date(2021, 1, 1),
          endDate: new Date(2021, 1, 1)
        }
      ];

      service.getUpcomingCompetitions().subscribe((competitions: Competition[]) => {
        expect(competitions).toEqual(mockCompetitions);
        done();
      });

      const request = httpMock.expectOne('/api/events/upcoming');
      expect(request.request.method).toBe('GET');
      request.flush(mockCompetitions);
    });

    it('should handle an error', (done) => {
      service.getUpcomingCompetitions().subscribe({
        next: () => {
          fail('Should not have succeeded');
          done();
        },
        error: (error) => {
          const expectedError = new Error("Error getting upcoming competitions");
          expect(error).toEqual(expectedError);
          done();
        }
      });

      const request = httpMock.expectOne('/api/events/upcoming');
      expect(request.request.method).toBe('GET');
      request.flush('Error', { status: 500, statusText: 'Error' });
    });
  });

  describe('getAllCompetitions', () => {

    it('should return all competitions', (done) => {
      const mockCompetitions: Competition[] = [
        {
          _id: '1',
          name: 'Competition 1',
          registrationName: 'Competition 1',
          venue: 'Venue 1',
          address: 'Address 1',
          city: 'City 1',
          province: 'Province 1',
          startDate: new Date(2021, 1, 1),
          endDate: new Date(2021, 1, 1)
        },
        {
          _id: '2',
          name: 'Competition 2',
          registrationName: 'Competition 2',
          venue: 'Venue 2',
          address: 'Address 2',
          city: 'City 2',
          province: 'Province 2',
          startDate: new Date(2021, 1, 1),
          endDate: new Date(2021, 1, 1)
        },
        {
          _id: '3',
          name: 'Competition 3',
          registrationName: 'Competition 3',
          venue: 'Venue 3',
          address: 'Address 3',
          city: 'City 3',
          province: 'Province 3',
          startDate: new Date(2021, 1, 1),
          endDate: new Date(2021, 1, 1)
        }
      ];

      service.getAllCompetitions().subscribe((competitions: Competition[]) => {
        expect(competitions).toEqual(mockCompetitions);
        done();
      });

      const request = httpMock.expectOne('/api/events');
      expect(request.request.method).toBe('GET');
      request.flush(mockCompetitions);
    });

    it('should handle an error', (done) => {
      service.getAllCompetitions().subscribe({
        next: () => {
          fail('Should not have succeeded');
          done();
        },
        error: (error) => {
          const expectedError = new Error("Error getting all competitions");
          expect(error).toEqual(expectedError);
          done();
        }
      });

      const request = httpMock.expectOne('/api/events');
      expect(request.request.method).toBe('GET');
      request.flush('Error', { status: 500, statusText: 'Error' });
    });
  });

  describe('deleteCompetition', () => {

    it('should delete the competition', (done) => {
      service.deleteCompetition("1").subscribe(() => {
        done();
      });

      const request = httpMock.expectOne('/api/events/1');
      expect(request.request.method).toBe('DELETE');
      request.flush({});
    });

    it('should handle an error', (done) => {
      service.deleteCompetition("1").subscribe({
        next: () => {
          fail('Should not have succeeded');
          done();
        },
        error: (error) => {
          const expectedError = new Error("Error deleting competition");
          expect(error).toEqual(expectedError);
          done();
        }
      });

      const request = httpMock.expectOne('/api/events/1');
      expect(request.request.method).toBe('DELETE');
      request.flush('Error', { status: 500, statusText: 'Error' });
    });
  });

  describe('updateCompetition', () => {

    it('should update the competition', (done) => {
      const mockCompetition: Competition = {
        _id: '1',
        name: 'Competition 1',
        registrationName: 'Competition 1',
        venue: 'Venue 1',
        address: 'Address 1',
        city: 'City 1',
        province: 'Province 1',
        startDate: new Date(2021, 1, 1),
        endDate: new Date(2021, 1, 1)
      };

      service.updateCompetition(mockCompetition).subscribe(() => {
        done();
      });

      const request = httpMock.expectOne('/api/events/1');
      expect(request.request.method).toBe('PUT');
      request.flush({});
    });

    it('should handle an error', (done) => {
      const mockCompetition: Competition = {
        _id: '1',
        name: 'Competition 1',
        registrationName: 'Competition 1',
        venue: 'Venue 1',
        address: 'Address 1',
        city: 'City 1',
        province: 'Province 1',
        startDate: new Date(2021, 1, 1),
        endDate: new Date(2021, 1, 1)
      };

      service.updateCompetition(mockCompetition).subscribe({
        next: () => {
          fail('Should not have succeeded');
          done();
        },
        error: (error) => {
          const expectedError = new Error("Error updating competition");
          expect(error).toEqual(expectedError);
          done();
        }
      });

      const request = httpMock.expectOne('/api/events/1');
      expect(request.request.method).toBe('PUT');
      request.flush('Error', { status: 500, statusText: 'Error' });
    });
  });

  describe('addCompetition', () => {

    it('should add the competition', (done) => {
      const mockCompetition: Competition = {
        _id: '1',
        name: 'Competition 1',
        registrationName: 'Competition 1',
        venue: 'Venue 1',
        address: 'Address 1',
        city: 'City 1',
        province: 'Province 1',
        startDate: new Date(2021, 1, 1),
        endDate: new Date(2021, 1, 1)
      };

      service.addCompetition(mockCompetition).subscribe((response) => {
        expect(response).toEqual(mockCompetition);
        done();
      });

      const request = httpMock.expectOne('/api/events');
      expect(request.request.method).toBe('POST');
      request.flush(mockCompetition);
    });

    it('should handle an error', (done) => {
      const mockCompetition: Competition = {
        _id: '1',
        name: 'Competition 1',
        registrationName: 'Competition 1',
        venue: 'Venue 1',
        address: 'Address 1',
        city: 'City 1',
        province: 'Province 1',
        startDate: new Date(2021, 1, 1),
        endDate: new Date(2021, 1, 1)
      };

      service.addCompetition(mockCompetition).subscribe({
        next: () => {
          fail('Should not have succeeded');
          done();
        },
        error: (error) => {
          const expectedError = new Error("Error adding competition");
          expect(error).toEqual(expectedError);
          done();
        }
      });

      const request = httpMock.expectOne('/api/events');
      expect(request.request.method).toBe('POST');
      request.flush('Error', { status: 500, statusText: 'Error' });
    });
  });

  describe('sendNotifications', () => {

    it('should send notifications', (done) => {


      service.sendNotifications(mockCompetition).subscribe(() => {
        done();
      });

      const request = httpMock.expectOne('/api/events/1/notify');
      expect(request.request.method).toBe('POST');
      request.flush({});
    });

    it('should handle an error', (done) => {
      const mockCompetition: Competition = {
        _id: '1',
        name: 'Competition 1',
        registrationName: 'Competition 1',
        venue: 'Venue 1',
        address: 'Address 1',
        city: 'City 1',
        province: 'Province 1',
        startDate: new Date(2021, 1, 1),
        endDate: new Date(2021, 1, 1)
      };

      service.sendNotifications(mockCompetition).subscribe({
        next: () => {
          fail('Should not have succeeded');
          done();
        },
        error: (error) => {
          const expectedError = new Error("Error sending notifications");
          expect(error).toEqual(expectedError);
          done();
        }
      });

      const request = httpMock.expectOne('/api/events/1/notify');
      expect(request.request.method).toBe('POST');
      request.flush('Error', { status: 500, statusText: 'Error' });
    });
  });
});
