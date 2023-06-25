import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RankingTableComponent } from './ranking-table.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { Ranking, ProvincialRankingsService } from 'src/app/services/provincial-rankings/provincial-rankings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { PageSelectorComponent } from '../page-selector/page-selector.component';
import { of, throwError } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';
import { SimpleChange } from '@angular/core';

const mockRankingData: Ranking[] = [
  {
    _id: '1',
    userId: '1',
    eventId: '333',
    wcaID: '2000ABCD01',
    personName: 'Test Person',
    countryRank: 1,
    province: 'GT',
    provinceRank: 1,
    best: '1.00'
  },
  {
    _id: '2',
    userId: '2',
    eventId: '333',
    wcaID: '2000ABCD02',
    personName: 'Someone Else',
    countryRank: 2,
    province: 'GT',
    provinceRank: 2,
    best: '2.00'
  },
  {
    _id: '3',
    userId: '3',
    eventId: '333',
    wcaID: '2000WXYZ01',
    personName: 'Test Person',
    countryRank: 4,
    province: 'GT',
    provinceRank: 3,
    best: '3.00'
  },
  {
    _id: '4',
    userId: '4',
    eventId: '333',
    wcaID: '2001WXYZ02',
    personName: 'Yet Another Person',
    countryRank: 5,
    province: 'WC',
    provinceRank: 4,
    best: '4.00'
  }
];


describe('RankingTableComponent', () => {
  let component: RankingTableComponent;
  let fixture: ComponentFixture<RankingTableComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;
  let rankingsService: jasmine.SpyObj<ProvincialRankingsService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(() => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvincesWithCodes', 'getProvinceName'
    ]);
    provinceServiceSpy.getProvinceName.and.returnValue('Gauteng');
    const rankingsServiceSpy = jasmine.createSpyObj('RankingsService', [
      'getRankings', 'getRankingsCount', 'cancelPendingRankingRequests', 'cancelPendingCountRequests'
    ]);
    rankingsServiceSpy.getRankings.and.returnValue(of(mockRankingData));
    rankingsServiceSpy.getRankingsCount.and.returnValue(of(4));

    const alertsServiceSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        RankingTableComponent,
        MockComponent(PageSelectorComponent)
      ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: ProvincialRankingsService, useValue: rankingsServiceSpy },
        { provide: AlertsService, useValue: alertsServiceSpy },
      ]
    });
    fixture = TestBed.createComponent(RankingTableComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;
    rankingsService = TestBed.inject(ProvincialRankingsService) as jasmine.SpyObj<ProvincialRankingsService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  describe('rendering', () => {
    beforeEach(() => {
      component.ngOnChanges({});
      fixture.detectChanges();
    });

    it('should have a table', () => {
      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();
    });

    it('should have four data rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(4);
    });
  });

  describe('paging', () => {
    it('should default to page 1', () => {
      expect(component.page).toBe(1);
    });

    it('should use the page from the query param when initialising', () => {
      activatedRoute.queryParams = of({ page: '2' });
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.page).toBe(2);
    });

    it('should use the page when querying rankings', () => {
      activatedRoute.queryParams = of({ page: '3' });
      component.ngOnInit();
      fixture.detectChanges();

      expect(rankingsService.getRankings).toHaveBeenCalledWith(
        component.event,
        component.province,
        component.type,
        3
      );
    });

    it('should update the query param when changing page', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.onPageChange(4);
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(
        jasmine.any(Array),
        jasmine.objectContaining({
          queryParams: { page: 4 },
          queryParamsHandling: 'merge'
        })
      );
    });

    it('should reset to page 1 when changing selectors', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.page = 3;
      component.event = '444';
      component.ngOnChanges({
        event: new SimpleChange('333', '444', false)
      });
      fixture.detectChanges();

      expect(component.page).toBe(1);
    });
  });

  describe('error handling', () => {

    it('should handle an error when querying rankings', () => {
      rankingsService.getRankings.and.returnValue(throwError(() => new Error('Test Ranking Error')));
      component.ngOnChanges({});
      fixture.detectChanges();

      expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Error while fetching rankings from server.");
    });

    it('should handle an error when querying rankings count', () => {
      rankingsService.getRankingsCount.and.returnValue(throwError(() => new Error('Test Count Error')));
      component.ngOnChanges({});
      fixture.detectChanges();

      expect(alerts.addAlert).toHaveBeenCalledWith("danger", "Error while fetching rankings from server.");
    });
  });
});
