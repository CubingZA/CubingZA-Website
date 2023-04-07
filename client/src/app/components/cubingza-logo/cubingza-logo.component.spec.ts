import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubingzaLogoComponent } from './cubingza-logo.component';

describe('CubingzaLogoComponent', () => {
  let component: CubingzaLogoComponent;
  let fixture: ComponentFixture<CubingzaLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CubingzaLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CubingzaLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
