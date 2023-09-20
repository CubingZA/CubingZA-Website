import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { HomeComponent } from './home.component';
import { AboutSummaryComponent } from 'src/app/components/about-summary/about-summary.component';
import { LinksBoxComponent } from 'src/app/components/links-box/links-box.component';
import { NationalRecordsListComponent } from 'src/app/components/national-records-list/national-records-list.component';
import { UpcomingCompsComponent } from 'src/app/components/upcoming-comps/upcoming-comps.component';
import { BannerComponent } from 'src/app/components/banner/banner.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockComponent(AboutSummaryComponent),
        MockComponent(LinksBoxComponent),
        MockComponent(NationalRecordsListComponent),
        MockComponent(UpcomingCompsComponent),
        MockComponent(BannerComponent)
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
