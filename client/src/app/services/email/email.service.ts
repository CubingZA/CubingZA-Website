import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailMessage } from 'src/app/interfaces/email/email-message';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(message: EmailMessage) {
    return this.http.post('/api/contact/send', message);
  }
}
