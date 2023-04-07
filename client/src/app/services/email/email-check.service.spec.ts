import { TestBed } from '@angular/core/testing';

import { EmailCheckService } from './email-check.service';

describe('EmailCheckService', () => {
  let service: EmailCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
