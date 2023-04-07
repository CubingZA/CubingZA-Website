import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCompetitionsComponent } from './manage-competitions.component';

describe('CompetitionsComponent', () => {
  let component: ManageCompetitionsComponent;
  let fixture: ComponentFixture<ManageCompetitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCompetitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
