import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { UserService } from '../user/user.service';

import { User } from 'src/app/interfaces/user/user';
import { NewUser } from 'src/app/interfaces/user/new-user';
import { LoginDetails } from 'src/app/interfaces/auth/login-details';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User | undefined;
  private busyUpdatingUser: boolean = false;
  private redirectUrl: string;

  constructor(
      private http: HttpClient,
      private cookies: CookieService,
      private router: Router,
      private userService: UserService
  ) {
    this.currentUser = undefined;
    this.redirectUrl = "/";

    if (this.cookies.check('token')) {
      this.updateCurrentUser();
    }
  }

  getCurrentUser() {
    // if (!this.busyUpdatingUser) {
    //   this.updateCurrentUser();
    // }
    return this.currentUser;
  }

  isLocalUser(): boolean {
    return this.currentUser ? this.currentUser.provider.indexOf('local') >= 0 : false;
  }

  isWCAUser(): boolean {
    return this.currentUser ? this.currentUser.provider.indexOf('wca') >= 0 : false;
  }

  isLoggedIn(): boolean {
    if (this.currentUser) {
      return true;
    }
    return this.checkJWT();
  }

  hasVerifiedEmail(): boolean {
    if (this.currentUser && this.currentUser.role !== 'unverified') {
      return true;
    } else {
      const decodedJWT = this.getDecodedJWT();
      if (decodedJWT && decodedJWT.role && decodedJWT.role !== 'unverified') {
        return true;
      }
    }
    return false;
  }

  isAdmin(): boolean {
    if (this.currentUser && this.currentUser.role === 'admin') {
      return true;
    } else {
      const decodedJWT = this.getDecodedJWT();
      if (decodedJWT && decodedJWT.role === 'admin') {
        return true;
      }
    }
    return false;
  }

  register(user: NewUser, errorCb: (err: any)=>void): void {
    this.http.post<Token>('/api/users', user)
    .subscribe({
      next: (data: Token) => {
        this.finishLoginProcess(data.token);
      },
      error: (error) => {
        errorCb(error);
      }
    });
  }

  login(loginDetails: LoginDetails): Observable<Token> {
    return this.http.post<Token>('/auth/local', loginDetails)
    .pipe(
      tap((data: Token) => {
        this.finishLoginProcess(data.token);
      }),
      catchError(error => {
        switch (error.status) {
          case 401:
            return throwError(()=>error); // Invalid email or password, handled in component
          case 504:
            return throwError(()=>error); // Server timeout, handled in component
          default:
            throw new Error("Error logging in");
        }
      })
    );
  }

  logout() {
    this.cookies.delete('token');
    this.currentUser = undefined;
    this.redirectToLogin();
  }

  redirectToLogin() {
    window.location.href = "/login";
  }

  startWcaLogin() {
    const params = new URLSearchParams({next: window.location.origin});
    window.location.href = "/auth/wca?" + params.toString();
  }

  connectWcaAccount() {
    const params = new URLSearchParams({next: window.location.origin + "/settings"});
    window.location.href = "/auth/wca/merge?" + params.toString();
  }

  finishLoginProcess(token: string) {
    this.cookies.set('token', token);
    this.updateCurrentUser(() => {
      this.router.navigate([this.redirectUrl]);
    });
  }

  updateCurrentUser(callback?: () => void): Observable<User> {
    let sendResult: (user: User) => void = () => {};
    let observable = new Observable<User>(observer => {
      sendResult = (user: User) => {
        observer.next(user);
        observer.complete();
      }
    });

    this.busyUpdatingUser = true;
    this.userService.getCurrentUser()
    .subscribe({
      next: (data: User) => {
        this.busyUpdatingUser = false;
        this.currentUser = data;
        sendResult(this.currentUser);
        if (callback) {
          callback();
        }
      },
      error: (error) => {
        this.busyUpdatingUser = false;
        console.log("Error while fetching user");
        this.logout();
      }
    });

    return observable;
  }

  private checkJWT(): boolean {
    if (this.cookies.get('token')) {
      const decodedJwt = this.getDecodedJWT();
      if (decodedJwt) {
        const now = Date.now() / 1000;
        if (decodedJwt.exp && decodedJwt.exp > now && decodedJwt.iat && decodedJwt.iat < now) {
          // Check if the JWT has not expired and is within the valid timeframe
          return true;
        }
      }
    }
    return false;
  }

  private getDecodedJWT(): any {
    const jwt = this.cookies.get('token');
    if (jwt) {
      // Decode the JWT payload
      return JSON.parse(window.atob(jwt.split('.')[1]));
    }
  }
}

export type Token = {
  "token": string;
}