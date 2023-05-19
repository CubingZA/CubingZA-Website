import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { AccountRoutes } from './account/account.routes';
import { AuthGuard } from './account/auth.guard';
import { AdminGuard } from './pages/admin/admin.guard';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';

export const AppRoutes: Routes = [
  { path: '', component: HomeComponent, title: 'CubingZA - Home' },
  { path: 'about', component: AboutComponent, title: 'CubingZA - About' },
  { path: 'privacy', component: PrivacyComponent, title: 'CubingZA - Privacy Policy' },
  { path: 'terms', component: TermsComponent, title: 'CubingZA - Terms of Use' },
  { path: 'notifications', canActivate: [AuthGuard], component: NotificationsComponent, title: 'CubingZA - Notifications' },
  { path: 'contact', component: ContactComponent, title: 'CubingZA - Contact Us' },
  ...AccountRoutes,
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canMatch: [AdminGuard]
  }


];
