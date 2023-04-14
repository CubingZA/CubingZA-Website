import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CompetitionService } from './competition.service';

describe('CompetitionService', () => {
  let service: CompetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CompetitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
