import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(message: EmailMessage) {
    return this.http.post('/api/contact/send', message);
  }
}

export type EmailMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};