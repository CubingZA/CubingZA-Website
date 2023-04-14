import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

import { ManageUsersComponent } from './pages/admin/manage-users/manage-users.component';
import { ManageCompetitionsComponent } from './pages/admin/manage-competitions/manage-competitions.component';

import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import { WcaLoginComponent } from './account/wcalogin/wcalogin.component';
import { SettingsComponent } from './account/settings/settings.component';
import { VerifyComponent } from './account/verify/verify.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { ModalComponent } from './components/modal/modal.component';

import { CubingzaLogoComponent } from './components/cubingza-logo/cubingza-logo.component';
import { AboutSummaryComponent } from './components/about-summary/about-summary.component';
import { RotatingCubeComponent } from './components/rotating-cube/rotating-cube.component';
import { LinksBoxComponent } from './components/links-box/links-box.component';
import { UpcomingCompsComponent } from './components/upcoming-comps/upcoming-comps.component';
import { RecordsListComponent } from './components/records-list/records-list.component';
import { ProvinceMapComponent } from './components/province-map/province-map.component';
import { ProvinceListComponent } from './components/province-list/province-list.component';
import { CompEditBoxComponent } from './components/comp-edit-box/comp-edit-box.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BannerComponent,
    AboutSummaryComponent,
    LinksBoxComponent,
    UpcomingCompsComponent,
    RecordsListComponent,
    ProvinceMapComponent,
    AboutComponent,
    PrivacyComponent,
    NotificationsComponent,
    ManageUsersComponent,
    ManageCompetitionsComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent,
    WcaLoginComponent,
    SettingsComponent,
    VerifyComponent,
    RotatingCubeComponent,
    CubingzaLogoComponent,
    NavbarComponent,
    FooterComponent,
    ProvinceListComponent,
    ModalComponent,
    CompEditBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }