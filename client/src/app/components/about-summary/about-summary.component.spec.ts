import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RotatingCubeComponent } from 'src/app/components/rotating-cube/rotating-cube.component';

import { AboutSummaryComponent } from './about-summary.component';

describe('AboutSummaryComponent', () => {
  let component: AboutSummaryComponent;
  let fixture: ComponentFixture<AboutSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ AboutSummaryComponent, RotatingCubeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
