import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedWarningComponent } from './unverified-warning.component';

describe('UnverifiedWarningComponent', () => {
  let component: UnverifiedWarningComponent;
  let fixture: ComponentFixture<UnverifiedWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnverifiedWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnverifiedWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
