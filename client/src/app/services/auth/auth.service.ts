import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService, User } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User | undefined;
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
        this.cookies.set('token', data.token);
        this.updateCurrentUser();
        this.router.navigate([this.redirectURL]);
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
    window.location.reload();
  }

  startWcaLogin() {    
    const params = new URLSearchParams({next: window.location.origin});
    window.location.href = "/auth/wca?" + params.toString();
  }

  finishWcaLogin(token: string) {
    this.cookies.set('token', token);
    this.updateCurrentUser(() => {
      this.router.navigate([this.redirectURL]);
    });
  }

  private async updateCurrentUser(callback?: () => void) { 
    this.userService.getCurrentUser()
    .subscribe({
      next: (data: User) => {
        this.currentUser = data;
        if (callback) {
          callback();
        }
      },
      error: (error) => {
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