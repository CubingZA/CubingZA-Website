import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutRoutes } from './about.routes';

@NgModule({
  imports: [RouterModule.forChild(AboutRoutes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
