import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { NationalRecordsListComponent } from './national-records-list.component';
import { RecordService } from 'src/app/services/record/record.service';

import { Record } from 'src/app/interfaces/record/record';

const mockPastDate = new Date(2020, 1, 1);
const mockToday = new Date(2023, 1, 1);
const mockNewDate = new Date(2222, 1, 1);

const mockRecordData: Record[] = [
  {
    eventName: "3x3x3 Cube",
    eventId: "333",
    singleResult: "1:00:00",
    singleName: ["John Doe"],
    singleId: ["1"],
    singleDate: [mockPastDate],
    averageResult: "1:30:00",
    averageName: ["John Doe"],
    averageId: ["1"],
    averageDate: [mockPastDate],
    eventRank: 1
  },
  {
    eventName: "Skewb",
    eventId: "skewb",
    singleResult: "0:30:00",
    singleName: ["Bob Person"],
    singleId: ["2"],
    singleDate: [mockNewDate],
    averageResult: "0:40:00",
    averageName: ["Someone Else"],
    averageId: ["3"],
    averageDate: [mockNewDate],
    eventRank: 2
  }
];

describe('NationalRecordsListComponent', () => {
  let component: NationalRecordsListComponent;
  let fixture: ComponentFixture<NationalRecordsListComponent>;

  let recordService: jasmine.SpyObj<RecordService>;

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(mockToday);

    const recordServiceSpy = jasmine.createSpyObj('RecordService', [
      'getNationalRecords'
    ]);
    recordServiceSpy.getNationalRecords.and.returnValue(of(mockRecordData));

    await TestBed.configureTestingModule({
      declarations: [ NationalRecordsListComponent ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalRecordsListComponent);
    component = fixture.componentInstance;

    recordService = TestBed.inject(RecordService) as jasmine.SpyObj<RecordService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create and show a table of records', () => {
    expect(component).toBeTruthy();
    const rows = fixture.nativeElement.querySelectorAll('.record-table-row');
    expect(rows.length).toEqual(2);
  });

  it('should handle an server timeout when fetching records', () => {
    recordService.getNationalRecords.and.returnValue(throwError(()=>{return {status: 504}}));
    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.record-list-container').textContent)
    .toContain('Could not fetch records. The server is not responding.');
    expect(fixture.nativeElement.querySelectorAll('.record-table-row').length).toEqual(0);
  });

  it('should handle any other error when fetching records', () => {
    recordService.getNationalRecords.and.returnValue(throwError(()=>{return {status: 500}}));
    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.record-list-container').textContent)
    .toContain('Could not fetch records. Please try again later.');
    expect(fixture.nativeElement.querySelectorAll('.record-table-row').length).toEqual(0);
  });

  describe('isNew', () => {

    it('should return true for dates within the last month', () => {
      expect(component.isNew([mockToday])).toBeTrue();
      expect(component.isNew([mockNewDate])).toBeTrue();
    });

    it('should return false for dates older than a month', () => {
      expect(component.isNew([mockPastDate])).toBeFalse();
    });

    it('should return false for empty dates', () => {
      expect(component.isNew([])).toBeFalse();
    });

    it('should return false for multiple past dates', () => {
      expect(component.isNew([mockPastDate, mockPastDate])).toBeFalse();
    });

    it('should return true for multiple new dates', () => {
      expect(component.isNew([mockToday, mockNewDate])).toBeTrue();
    });

    it('should return true for a mix of new and old dates', () => {
      expect(component.isNew([mockToday, mockPastDate])).toBeTrue();
    });

    it('should show a NEW tag for new records', () => {
      const rows = fixture.nativeElement.querySelectorAll('.record-table-row');
      expect(rows[1].textContent).toContain('New');
      expect(rows[0].textContent).not.toContain('New');
    });
  });

});
