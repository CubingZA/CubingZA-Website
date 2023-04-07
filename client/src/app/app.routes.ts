import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { AccountRoutes } from './account/account.routes';
import { AuthGuard } from './account/auth.guard';
import { AdminGuard } from './pages/admin/admin.guard';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

export const AppRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'notifications', canActivate: [AuthGuard], component: NotificationsComponent },
  { path: 'contact', component: ContactComponent },
  ...AccountRoutes,
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canMatch: [AdminGuard]
  }

  
];
