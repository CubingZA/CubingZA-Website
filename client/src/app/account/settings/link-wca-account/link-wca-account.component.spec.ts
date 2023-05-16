import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkWcaAccountComponent } from './link-wca-account.component';

describe('LinkWcaAccountComponent', () => {
  let component: LinkWcaAccountComponent;
  let fixture: ComponentFixture<LinkWcaAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkWcaAccountComponent]
    });
    fixture = TestBed.createComponent(LinkWcaAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
