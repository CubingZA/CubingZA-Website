import { Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { AboutComponent } from './about_us/about.component';
import { VolunteerComponent } from './volunteer/volunteer.component';

export const AboutRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'faq', component: FaqComponent, title: 'CubingZA - FAQ' },
      { path: 'about_us', component: AboutComponent, title: 'CubingZA - About' },
      { path: 'volunteer', component: VolunteerComponent, title: 'CubingZA - Volunteer' },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
];
