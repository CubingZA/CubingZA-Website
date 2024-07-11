import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmailService } from './email.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EmailService', () => {
  let service: EmailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(EmailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('sendEmail', () => {
    it('should send an email', () => {
      const message = {
        name: 'Test',
        email: 'bob@example.com',
        subject: 'Test Subject',
        message: 'Test Message'
      };

      service.sendEmail(message).subscribe();

      const req = httpMock.expectOne('/api/contact/send');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(message);

      req.flush(message);
    });
  });
});
