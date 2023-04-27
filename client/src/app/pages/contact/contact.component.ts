import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { EmailMessage, EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.less']
})
export class ContactComponent {

  sending: boolean = false;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('')
  });

  constructor(
    private emailService: EmailService,
    private alerts: AlertsService
  ) { }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get subject(): FormControl { return this.form.get('subject') as FormControl; }
  get message(): FormControl { return this.form.get('message') as FormControl; }

  submit() {
    const message: EmailMessage = {
      name: this.name.value,
      email: this.email.value,
      subject: this.subject.value,
      message: this.message.value
    };

    this.sending = true;
    this.alerts.clear();

    this.emailService.sendEmail(message).subscribe({
      next: () => {
        this.alerts.addAlert("success", "Message sent!");
        this.sending = false;
      },
      error: (err) => {
        this.alerts.addAlert("danger", "Error sending message. Please try again later.");
        this.sending = false;
      }
    });
      }

}
