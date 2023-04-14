import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProvinceService } from './province.service';

describe('ProvincesService', () => {
  let service: ProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProvinceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
