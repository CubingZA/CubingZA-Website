import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsListComponent } from './records-list.component';
import { RecordService } from 'src/app/services/record/record.service';
import { of } from 'rxjs';

const mockRecordData = [
  {
    eventName: "3x3x3 Cube",
    eventId: "333",
    singleName: "John Doe",
    singleResult: "1:00:00",
    singleId: "1",
    averageName: "John Doe",
    averageResult: "1:30:00",
    averageId: "1",
    eventRank: 1
  },
  {
    eventName: "Skewb",
    eventId: "skewb",
    singleName: "Bob Person",
    singleResult: "0:30:00",
    singleId: "2",
    averageName: "Someone Else",
    averageResult: "0:40:00",
    averageId: "3",
    eventRank: 2
  }
];

describe('RecordsListComponent', () => {
  let component: RecordsListComponent;
  let fixture: ComponentFixture<RecordsListComponent>;

  let recordService: jasmine.SpyObj<RecordService>;

  beforeEach(async () => {
    const recordServiceSpy = jasmine.createSpyObj('RecordService', [
      'getRecords'
    ]);
    recordServiceSpy.getRecords.and.returnValue(of(mockRecordData));

    await TestBed.configureTestingModule({
      declarations: [ RecordsListComponent ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordsListComponent);
    component = fixture.componentInstance;

    recordService = TestBed.inject(RecordService) as jasmine.SpyObj<RecordService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
