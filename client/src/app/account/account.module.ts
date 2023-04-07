import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from './account.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccountRoutes)
  ]
})
export class AccountModule { }
