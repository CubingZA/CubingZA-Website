import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WcaLoginComponent } from './wcalogin.component';

describe('WcaloginComponent', () => {
  let component: WcaLoginComponent;
  let fixture: ComponentFixture<WcaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WcaLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WcaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
