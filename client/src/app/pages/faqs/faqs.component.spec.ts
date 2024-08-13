import { ComponentFixture, TestBed } from '@angular/core/testing';

import { faqsComponent } from './faqs.component';

describe('faqsComponent', () => {
  let component: faqsComponent;
  let fixture: ComponentFixture<faqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ faqsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(faqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
