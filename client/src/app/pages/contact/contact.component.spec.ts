import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';
import { EmailService } from 'src/app/services/email/email.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  let emailService: jasmine.SpyObj<EmailService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EmailService', ['sendEmail']);
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule ],
      declarations: [ ContactComponent ],
      providers: [
        { provide: EmailService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;

    emailService = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 4 controls', () => {
    expect(component.form.contains('name')).toBeTruthy();
    expect(component.form.contains('email')).toBeTruthy();
    expect(component.form.contains('subject')).toBeTruthy();
    expect(component.form.contains('message')).toBeTruthy();
  });

  it('should make the name control required', () => {
    let control = component.form.get('name');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    control?.setValue('test');
    expect(control?.valid).toBeTruthy();
  });

  it('should make the email control required', () => {
    let control = component.form.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    control?.setValue('test');
    expect(control?.valid).toBeFalsy();
    control?.setValue('test@example.com');
    expect(control?.valid).toBeTruthy();
  });

  it('should make the subject control required', () => {
    let control = component.form.get('subject');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    control?.setValue('test');
    expect(control?.valid).toBeTruthy();
  });

  it('should make the message control not required', () => {
    let control = component.form.get('message');
    control?.setValue('');
    expect(control?.valid).toBeTruthy();
    control?.setValue('test');
    expect(control?.valid).toBeTruthy();
  });

  it('should call the email service when the form is submitted', () => {
    component.form.setValue({
      name: 'Test Person',
      email: 'test@example.com',
      subject: 'This is a subject',
      message: 'a message'
    });
    component.submit();
    expect(emailService.sendEmail).toHaveBeenCalled();
  });



});
