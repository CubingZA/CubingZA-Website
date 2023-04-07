import { Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { ManageCompetitionsComponent } from './manage-competitions/manage-competitions.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

export const AdminRoutes: Routes = [
  { 
    path: '',     
    canActivate: [AdminGuard],
    children: [
      { path: 'users', component: ManageUsersComponent },
      { path: 'competitions', component: ManageCompetitionsComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }, 
];
