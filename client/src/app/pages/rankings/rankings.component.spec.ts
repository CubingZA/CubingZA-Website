import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsComponent } from './rankings.component';
import { MockComponent, MockedDebugElement, ngMocks } from 'ng-mocks';
import { RankingTableComponent } from 'src/app/components/ranking-table/ranking-table.component';
import { ProvinceService } from 'src/app/services/province/province.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('RankingsComponent', () => {
  let component: RankingsComponent;
  let fixture: ComponentFixture<RankingsComponent>;

  let provinceService: jasmine.SpyObj<ProvinceService>;
  let rankingsTable: MockedDebugElement<RankingTableComponent>;

  beforeEach(() => {
    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', [
      'getAvailableProvincesWithCodes'
    ]);
    provinceServiceSpy.getAvailableProvincesWithCodes.and.returnValue({
      GT: 'Gauteng',
      WC: 'Western Cape'
    });

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        RankingsComponent,
        MockComponent(RankingTableComponent)
      ],
      providers: [
        { provide: ProvinceService, useValue: provinceServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(RankingsComponent);
    component = fixture.componentInstance;

    provinceService = TestBed.inject(ProvinceService) as jasmine.SpyObj<ProvinceService>;

    fixture.detectChanges();

    rankingsTable = ngMocks.find(RankingTableComponent);
  });

  describe('initialization', () => {

    it('should should default to GT 333 single', () => {
      expect(component.province).toEqual('GT');
      expect(component.event).toEqual('333');
      expect(component.type).toEqual('single');
    });

    it('should update the form', () => {
      expect(component.provinceControl.value).toEqual('GT');
      expect(component.eventControl.value).toEqual('333');
      expect(component.typeControl.value).toEqual('single');
    });

    it('should update the rankings table', () => {
      expect(rankingsTable.componentInstance.province).toEqual('GT');
      expect(rankingsTable.componentInstance.event).toEqual('333');
      expect(rankingsTable.componentInstance.type).toEqual('single');
    });
  });

  describe('changes to inputs', () => {

    beforeEach(() => {
      component.province = 'WC';
      component.event = '444';
      component.type = 'average';

      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should update the form', () => {
      expect(component.provinceControl.value).toEqual('WC');
      expect(component.eventControl.value).toEqual('444');
      expect(component.typeControl.value).toEqual('average');
    });

    it('should update the rankings table', () => {
      expect(rankingsTable.componentInstance.province).toEqual('WC');
      expect(rankingsTable.componentInstance.event).toEqual('444');
      expect(rankingsTable.componentInstance.type).toEqual('average');
    });
  });

  describe('interacting with the form', () => {
    describe('changing province', () => {
      it('should update the province', () => {
        component.provinceControl.setValue('WC');
        fixture.detectChanges();

        expect(component.province).toEqual('WC');
        expect(rankingsTable.componentInstance.province).toEqual('WC');
      });
    });

    describe('changing event', () => {
      it('should update the event', () => {
        component.eventControl.setValue('444');
        fixture.detectChanges();

        expect(component.event).toEqual('444');
        expect(rankingsTable.componentInstance.event).toEqual('444');
      });
    });

    describe('changing type', () => {
      it('should update the type', () => {
        component.typeControl.setValue('average');
        fixture.detectChanges();

        expect(component.type).toEqual('average');
        expect(rankingsTable.componentInstance.type).toEqual('average');
      });
    });
  });

});
