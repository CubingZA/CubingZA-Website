import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingCompsComponent } from './upcoming-comps.component';

describe('UpcomingCompsComponent', () => {
  let component: UpcomingCompsComponent;
  let fixture: ComponentFixture<UpcomingCompsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingCompsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingCompsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
