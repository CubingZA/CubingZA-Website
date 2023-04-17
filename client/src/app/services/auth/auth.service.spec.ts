import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  let http: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
