import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvincialRecordsComponent } from './provincial-records.component';

describe('ProvincialRecordsComponent', () => {
  let component: ProvincialRecordsComponent;
  let fixture: ComponentFixture<ProvincialRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvincialRecordsComponent]
    });
    fixture = TestBed.createComponent(ProvincialRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
