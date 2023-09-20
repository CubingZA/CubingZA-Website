import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';

import { ContactComponent } from './contact.component';
import { EmailService } from 'src/app/services/email/email.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

import { EmailMessage } from 'src/app/interfaces/email/email-message';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  let emailService: jasmine.SpyObj<EmailService>;
  let alerts: jasmine.SpyObj<AlertsService>;

  const dummyMessage: EmailMessage = {
    name: 'Test Person',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test Message'
  };

  beforeEach(async () => {
    const emailSpy = jasmine.createSpyObj('EmailService', ['sendEmail']);
    const alertsSpy = jasmine.createSpyObj('AlertsService', [
      'addAlert', 'clear'
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule ],
      declarations: [ ContactComponent ],
      providers: [
        { provide: EmailService, useValue: emailSpy },
        { provide: AlertsService, useValue: alertsSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;

    emailService = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    alerts = TestBed.inject(AlertsService) as jasmine.SpyObj<AlertsService>;

    fixture.detectChanges();
  });
  describe('rendering the form', () => {
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

    describe('the submit button', () => {

      it('should have a submit button', () => {
        const button = fixture.nativeElement.querySelector('#submit-button');
        expect(button).toBeTruthy();
      });

      it('should be disabled when the form is invalid', () => {
        const button = fixture.nativeElement.querySelector('#submit-button');
        expect(button.disabled).toBeTruthy();
      });

      it('should be enabled when the form is valid', () => {
        component.form.setValue(dummyMessage);
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('#submit-button');
        expect(button.disabled).toBeFalsy();
      });
    });
  });

  describe('submitting the form', () => {

    it('should call the email service', () => {
      emailService.sendEmail.and.returnValue(of({}));
      component.form.setValue(dummyMessage);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('#submit-button');
      button.click();
      fixture.detectChanges();

      expect(emailService.sendEmail).toHaveBeenCalledWith(dummyMessage);
    });

    it('should set the sending flag to true while sending', () => {
      let finishSending: () => void = () => {};
      emailService.sendEmail.and.returnValue(
        new Observable(subscriber => {
          finishSending = () => {
            subscriber.next({});
            subscriber.complete();
          }
        })
      );
      component.form.setValue(dummyMessage);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('#submit-button');
      button.click();
      fixture.detectChanges();

      expect(component.sending).toBeTrue();

      finishSending();
      fixture.detectChanges();

      expect(component.sending).toBeFalse();
    });

    it('should handle errors', () => {
      emailService.sendEmail.and.returnValue(throwError(()=>'test error'));
      component.form.setValue(dummyMessage);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('#submit-button');
      button.click();
      fixture.detectChanges();

      expect(component.sending).toBeFalse();
      expect(alerts.addAlert).toHaveBeenCalledWith(
        "danger", "Error sending message. Please try again later."
      );
    });
  });
});
