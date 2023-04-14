import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailMessage, EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.less']
})
export class ContactComponent {

  errors: string[] = [];
  messages: string[] = [];
  sending: boolean = false;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('')
  });

  constructor(
    private emailService: EmailService
  ) { }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get subject(): FormControl { return this.form.get('subject') as FormControl; }
  get message(): FormControl { return this.form.get('message') as FormControl; }

  submit() {
    console.log(this.form);

    const message: EmailMessage = {
      name: this.name.value,
      email: this.email.value,
      subject: this.subject.value,
      message: this.message.value
    }

    this.sending = true;
    this.errors = [];
    this.messages = [];

    this.emailService.sendEmail(message).subscribe({
      next: () => {
        this.messages.push("Message sent!");
        this.sending = false;
      },
      error: (err) => {
        console.log(err);
        this.errors.push("Error sending message. Please try again later.");
        this.sending = false;
      }
    });
      }

}
