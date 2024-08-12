import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerComponent } from './volunteer.component';

describe('VolunteerComponent', () => {
  let component: VolunteerComponent;
  let fixture: ComponentFixture<VolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
