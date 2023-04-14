import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceMapComponent } from './province-map.component';

describe('ProvinceMapComponent', () => {
  let component: ProvinceMapComponent;
  let fixture: ComponentFixture<ProvinceMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinceMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
