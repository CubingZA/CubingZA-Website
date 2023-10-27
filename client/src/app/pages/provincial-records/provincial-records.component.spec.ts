import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { ProvincialRecordsComponent } from './provincial-records.component';
import { RecordService } from 'src/app/services/record/record.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { EventSelectorComponent } from 'src/app/components/event-selector/event-selector.component';

import { ProvincialRecordTable } from 'src/app/interfaces/record/provincial-record-table';

const mockProvincialRecords: ProvincialRecordTable = {
  "333": [
    {
      eventName: "3x3x3 Cube",
      eventId: "333",
      singleResult: "1:00:00",
      singleName: ["Test Person"],
      singleId: ["2345TEST01"],
      averageResult: "1:30:00",
      averageName: ["Test Person"],
      averageId: ["2345TEST02"],
      province: "GT"
    },
    {
      eventName: "3x3x3 Cube",
      eventId: "333",
      singleResult: "1:00:00",
      singleName: ["Test Person"],
      singleId: ["2345TEST03"],
      averageResult: "1:30:00",
      averageName: ["Another Person"],
      averageId: ["2345TEST04"],
      province: "WC"
    }
  ],
  "222": [
    {
      eventName: "2x2x2 Cube",
      eventId: "222",
      singleResult: "1:00:00",
      singleName: ["Someone Else"],
      singleId: ["2345TEST01"],
      averageResult: "",
      averageName: [],
      averageId: [],
      province: "GT"
    },
    {
      eventName: "2x2x2 Cube",
      eventId: "222",
      singleResult: "1:00:00",
      singleName: ["Test Person"],
      singleId: ["2345TEST03"],
      averageResult: "",
      averageName: [],
      averageId: [],
      province: "WC"
    }
  ]
}

describe('ProvincialRecordsComponent', () => {
  let component: ProvincialRecordsComponent;
  let fixture: ComponentFixture<ProvincialRecordsComponent>;

  let recordsService: jasmine.SpyObj<RecordService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  beforeEach(() => {
    const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getProvincialRecords']);
    recordServiceSpy.getProvincialRecords.and.returnValue(of({}));

    const provinceServiceSpy = jasmine.createSpyObj('ProvinceService', ['getProvinceName']);
    provinceServiceSpy.getProvinceName.and.callFake((provinceCode: string) => {
      switch (provinceCode) {
        case 'GT':
          return 'Gauteng';
        case 'WC':
          return 'Western Cape';
        default:
          return 'Unknown';
      }
    });
    const alertsServiceSpy = jasmine.createSpyObj('AlertsService', ['addAlert', 'clear']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MockComponent(EventSelectorComponent),
        ProvincialRecordsComponent
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ProvinceService, useValue: provinceServiceSpy },
        { provide: AlertsService, useValue: alertsServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(ProvincialRecordsComponent);
    component = fixture.componentInstance;

    recordsService = TestBed.inject(RecordService) as jasmine.SpyObj<RecordService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });

  describe('rendering', () => {
    beforeEach(() => {
      recordsService.getProvincialRecords.and.returnValue(of(mockProvincialRecords));
      component.ngOnInit();
      fixture.detectChanges();
    });


    it('should set provincial records', () => {
      expect(component.records).toEqual(mockProvincialRecords);
    });

    it('should render a table for each event', () => {
      const tables = fixture.nativeElement.querySelectorAll('table');
      expect(tables.length).toBe(17);
    });
  });

  describe('error handling', () => {

    it('should handle an error while loading records', () => {
      recordsService.getProvincialRecords.and.returnValue(throwError(()=>new Error('test error')));
      component.ngOnInit();
      expect(alerts.addAlert).toHaveBeenCalledWith('danger', 'Error while loading provincial records');
    });

    it('should handle empty records', () => {
      component.records = undefined;
      recordsService.getProvincialRecords.and.returnValue(throwError(()=>new Error('test error')));

      component.ngOnInit();

      const tables = fixture.nativeElement.querySelectorAll('table');
      expect(tables.length).toBe(17);
      tables.forEach((table: any) => {
        expect(table.querySelectorAll('tr').length).toBe(1);
        expect(table.querySelector('tr').textContent).toContain('No records yet');
      });
    });
  });
});
