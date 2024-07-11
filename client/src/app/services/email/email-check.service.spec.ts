import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmailCheckResponse, EmailCheckService } from './email-check.service';
import { delay, map } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EmailCheckService', () => {
  let service: EmailCheckService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(EmailCheckService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('checkEmail', () => {

    afterEach(() => {
      httpMock.verify();
    });

    it('should return valid: true for a valid email', async () => {
      const mockResponse: EmailCheckResponse = {
        valid: true
      };

      let result = await new Promise<EmailCheckResponse>((resolve) => {
        service.checkEmail("test@example.com").subscribe({
          next: response => resolve(response)
        });

        const req = httpMock.expectOne('/api/emails/check');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({ email: "test@example.com" });
        req.flush(mockResponse);
      });

      expect(result).toEqual(mockResponse);
    });

    it('should return valid: false for an invalid email', async () => {
      const mockResponse: EmailCheckResponse = {
        valid: false
      };

      let result = await new Promise<EmailCheckResponse>((resolve) => {
        service.checkEmail("this is not an email").subscribe({
          next: response => resolve(response)
        });

        const req = httpMock.expectOne('/api/emails/check');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({ email: "this is not an email" });
        req.flush(mockResponse);
      });

      expect(result).toEqual(mockResponse);
    });

    it ('should set didYouMean for a email with a typo', (done) => {
      const mockResponse: EmailCheckResponse = {
        valid: true,
        did_you_mean: "bob@example.com"
      };
      const typoEmail = "bad@exampel.com";

      service.checkEmail(typoEmail).subscribe({
        next: result => {
          expect(result).toEqual(mockResponse);
          expect(service.getDidYouMean()).toEqual(mockResponse.did_you_mean);
          done();
        }
      });

      const req = httpMock.expectOne('/api/emails/check');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ email: typoEmail });
      req.flush(mockResponse);
    });

    it ('should not set didYouMean if none is received', (done) => {
      const mockResponse: EmailCheckResponse = {
        valid: true
      };
      const validEmail = "bob@example.com";

      service.checkEmail(validEmail).subscribe({
        next: result => {
          expect(result).toEqual(mockResponse);
          expect(service.getDidYouMean()).toBeUndefined();
          done();
        }
      });

      const req = httpMock.expectOne('/api/emails/check');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ email: validEmail });
      req.flush(mockResponse);
    });
  });

  describe('hasDidYouMean', () => {
    it('should return false if didYouMean is undefined', () => {
      expect(service.hasDidYouMean()).toBeFalse();
    });

    it('should return true if didYouMean is defined', () => {
      service.setDidYouMean("bob@example.com");
      expect(service.hasDidYouMean()).toBeTrue();
    });
  });

  describe('getDidYouMean', () => {
    it('should return undefined if didYouMean is undefined', () => {
      expect(service.getDidYouMean()).toBeUndefined();
    });

    it('should return the didYouMean if it is defined', () => {
      const didYouMean = "bob@example.com";
      service.setDidYouMean(didYouMean);
      expect(service.getDidYouMean()).toEqual(didYouMean);
    });
  });

  describe('setDidYouMean', () => {
    it('should set didYouMean to undefined if no argument is given', () => {
      service.setDidYouMean();
      expect(service.getDidYouMean()).toBeUndefined();
    });

    it('should set didYouMean to the given value', () => {
      const didYouMean = "bob@example.com";
      service.setDidYouMean(didYouMean);
      expect(service.getDidYouMean()).toEqual(didYouMean);
    });
  });

  describe('useDidYouMean', () => {
    it('should return the suggestion and clear it', () => {
      const didYouMean = "bob@example.com";
      service.setDidYouMean(didYouMean);

      expect(service.hasDidYouMean()).toBeTrue();
      expect(service.useDidYouMean()).toEqual(didYouMean);
      expect(service.hasDidYouMean()).toBeFalse();
    });
  });
});
