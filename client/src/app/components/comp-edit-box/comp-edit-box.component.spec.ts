import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompEditBoxComponent } from './comp-edit-box.component';

describe('CompEditBoxComponent', () => {
  let component: CompEditBoxComponent;
  let fixture: ComponentFixture<CompEditBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompEditBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompEditBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
