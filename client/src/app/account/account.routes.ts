import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AllowLoginGuard } from './allow-login.guard';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';
import { WcaLoginComponent } from './wcalogin/wcalogin.component';
import { VerifyComponent } from './verify/verify.component';

export const AccountRoutes: Routes = [
  { path: 'signup', canActivate: [AllowLoginGuard], component: SignupComponent, title: 'CubingZA - Sign Up' },
  { path: 'login', canActivate: [AllowLoginGuard], component: LoginComponent, title: 'CubingZA - Log In',
    children: [
      { path: 'wca', component: WcaLoginComponent, title: 'CubingZA - Logging you in' }
    ]},
  { path: 'settings', canActivate: [AuthGuard], component: SettingsComponent, title: 'CubingZA - Settings' },
  { path: 'verify/:id', component: VerifyComponent, title: 'CubingZA - Verifying' },
];
