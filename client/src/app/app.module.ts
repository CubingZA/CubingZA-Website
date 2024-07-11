import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
import { ChangePasswordComponent } from './account/settings/change-password/change-password.component';
import { ChangeProvinceComponent } from './account/settings/change-province/change-province.component';
import { LinkWcaAccountComponent } from './account/settings/link-wca-account/link-wca-account.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { ModalComponent } from './components/modal/modal.component';

import { CubingzaLogoComponent } from './components/cubingza-logo/cubingza-logo.component';
import { AboutSummaryComponent } from './components/about-summary/about-summary.component';
import { RotatingCubeComponent } from './components/rotating-cube/rotating-cube.component';
import { LinksBoxComponent } from './components/links-box/links-box.component';
import { UpcomingCompsComponent } from './components/upcoming-comps/upcoming-comps.component';
import { NationalRecordsListComponent } from './components/national-records-list/national-records-list.component';
import { ProvinceMapComponent } from './components/province-map/province-map.component';
import { ProvinceListComponent } from './components/province-list/province-list.component';
import { CompEditBoxComponent } from './components/comp-edit-box/comp-edit-box.component';
import { UnverifiedWarningComponent } from './components/unverified-warning/unverified-warning.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProvincialRankingsComponent } from './pages/provincial-rankings/provincial-rankings.component';
import { RankingTableComponent } from './components/ranking-table/ranking-table.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { ProvincialRecordsComponent } from './pages/provincial-records/provincial-records.component';
import { EventSelectorComponent } from './components/event-selector/event-selector.component';


@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        BannerComponent,
        AboutSummaryComponent,
        LinksBoxComponent,
        UpcomingCompsComponent,
        NationalRecordsListComponent,
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
        CompEditBoxComponent,
        UnverifiedWarningComponent,
        AlertsComponent,
        ChangePasswordComponent,
        ChangeProvinceComponent,
        LinkWcaAccountComponent,
        ProvincialRankingsComponent,
        TermsComponent,
        RankingTableComponent,
        PageSelectorComponent,
        ProvincialRecordsComponent,
        EventSelectorComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule, FontAwesomeModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
