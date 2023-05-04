import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailCheckService {

  private didYouMean: string | undefined = undefined;

  constructor(private http: HttpClient) { }

  checkEmail(email: string): Observable<EmailCheckResponse> {
    const request = this.http.post<EmailCheckResponse>('/api/emails/check', { email: email })
    .pipe(tap(response => {
      if (response['did_you_mean']) {
        this.didYouMean = response['did_you_mean'];
      }
      return response;
    }));
    return request;
  }

  hasDidYouMean(): boolean {
    return this.didYouMean !== undefined;
  }

  getDidYouMean(): string | undefined {
    return this.didYouMean;
  }

  useDidYouMean(): string | undefined {
    const result = this.didYouMean;
    this.didYouMean = undefined;
    return result;
  }

  setDidYouMean(didYouMean?: string | undefined) {
    this.didYouMean = didYouMean;
  }
}

export type EmailCheckResponse = {
  valid: boolean;
  did_you_mean?: string;
};