import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksBoxComponent } from './links-box.component';

describe('LinksBoxComponent', () => {
  let component: LinksBoxComponent;
  let fixture: ComponentFixture<LinksBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinksBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinksBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
