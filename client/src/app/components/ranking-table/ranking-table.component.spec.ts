import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RankingTableComponent } from './ranking-table.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { RankingsService } from 'src/app/services/rankings/rankings.service';
import { ActivatedRoute } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { PageSelectorComponent } from '../page-selector/page-selector.component';
import { of } from 'rxjs';

describe('RankingTableComponent', () => {
  let component: RankingTableComponent;
  let fixture: ComponentFixture<RankingTableComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;
  let rankingsService: jasmine.SpyObj<RankingsService>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvincesWithCodes'
    ]);
    const rankingsServiceSpy = jasmine.createSpyObj('RankingsService', [
      'getRankings'
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        RankingTableComponent,
        MockComponent(PageSelectorComponent)
      ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: RankingsService, useValue: rankingsServiceSpy },
      ]
    });
    fixture = TestBed.createComponent(RankingTableComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    rankingsService = TestBed.inject(RankingsService) as jasmine.SpyObj<RankingsService>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
