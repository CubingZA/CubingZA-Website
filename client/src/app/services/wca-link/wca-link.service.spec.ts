import { TestBed } from '@angular/core/testing';

import { WcaLinkService } from './wca-link.service';

describe('WcaLinkService', () => {
  let service: WcaLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WcaLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
