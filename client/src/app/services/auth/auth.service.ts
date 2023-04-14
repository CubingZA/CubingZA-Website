import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService, User, NewUser } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User | undefined;
  private busyUpdatingUser: boolean = false;
  private redirectURL: string;

  constructor(
      private http: HttpClient,
      private cookies: CookieService,
      private router: Router,
      private userService: UserService
  ) {
    this.currentUser = undefined;
    this.redirectURL = "/";

    if (this.cookies.check('token')) {
      this.updateCurrentUser();
    }
  }

  getCurrentUser() {
    if (!this.busyUpdatingUser) {
      this.updateCurrentUser();
    }
    return this.currentUser;
  }

  isLocalUser(): boolean {
    return this.currentUser ? this.currentUser.provider === 'local' : false;
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

  register(user: NewUser, errorCb: (err: any)=>void): Observable<Token> {
    const registerAttempt = this.http.post<Token>('/api/users', user);

    registerAttempt.subscribe({
      next: (data: Token) => {
        this.finishLoginProcess(data.token);
      },
      error: (error) => {
        errorCb(error);
      }
    });

    return registerAttempt;
  }

  login(loginDetails: LoginDetails): Observable<Token> {
    const loginAttempt = this.http.post<Token>('/auth/local', loginDetails);

    loginAttempt.subscribe({
      next: (data: Token) => {
        this.finishLoginProcess(data.token);
      },
      error: (error) => {
        switch (error.status) {
          case 401:
            break; // Invalid email or password, handled in component
          case 504:
            break; // Server timeout, handled in component
          default:
            console.log(error);
            throw new Error("Error logging in");
        }
      }
    });

    return loginAttempt;
  }

  logout() {
    this.cookies.delete('token');
    this.currentUser = undefined;
    window.location.href = "/";
  }

  startWcaLogin() {
    const params = new URLSearchParams({next: window.location.origin});
    window.location.href = "/auth/wca?" + params.toString();
  }

  finishLoginProcess(token: string) {
    this.cookies.set('token', token);
    this.updateCurrentUser(() => {
      this.router.navigate([this.redirectURL]);
    });
  }

  async updateCurrentUser(callback?: () => void) {
    this.busyUpdatingUser = true;
    this.userService.getCurrentUser()
    .subscribe({
      next: (data: User) => {
        this.busyUpdatingUser = false;
        this.currentUser = data;
        if (callback) {
          callback();
        }
      },
      error: (error) => {
        this.busyUpdatingUser = false;
        this.logout();
        throw new Error("Error fetching user");
      }
    });
  }

  private checkJWT(): boolean {
    const decodedJwt = this.getDecodedJWT();
    if (decodedJwt) {
      const now = Date.now() / 1000;
      if (decodedJwt.exp && decodedJwt.exp > now && decodedJwt.iat && decodedJwt.iat < now) {
        // Check if the JWT has not expired and is within the valid timeframe
        return true;
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

export type LoginDetails = {
  email: string;
  password: string;
}

export type Token = {
  "token": string;
}