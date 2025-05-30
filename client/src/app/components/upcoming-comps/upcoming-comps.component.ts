import { Component } from '@angular/core';
import { faLocationDot, faCaretUp, faCaretDown, faCircleArrowRight, faInfoCircle, faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { faMap, faCalendar } from '@fortawesome/free-regular-svg-icons';

import { AuthService } from 'src/app/services/auth/auth.service';
import { CompetitionService } from 'src/app/services/competition/competition.service';
import { WcaLinkService } from 'src/app/services/wca-link/wca-link.service';

import { Competition } from 'src/app/interfaces/competition/competition';

@Component({
    selector: 'app-upcoming-comps',
    templateUrl: './upcoming-comps.component.html',
    styleUrls: ['./upcoming-comps.component.less'],
    standalone: false
})
export class UpcomingCompsComponent {

  faMap = faMap;
  faLocationDot = faLocationDot;
  faCalendar = faCalendar;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  faInfoCircle = faInfoCircle;
  faCircleArrowRight = faCircleArrowRight;
  faAngleDoubleDown = faAngleDoubleDown;
  faAngleDoubleUp = faAngleDoubleUp;

  error: string = "";

  upcomingCompetitions: Competition[];

  constructor(
    private authService: AuthService,
    private compService: CompetitionService,
    private wcaLinkService: WcaLinkService
  ) {
    this.upcomingCompetitions = [];
  }

  ngOnInit(): void {
    this.updateUpcomingCompetitions();
  }

  updateUpcomingCompetitions() {
    this.compService.getUpcomingCompetitions()
    .subscribe({
      next: (data: Competition[]) => {
        this.upcomingCompetitions = data;
        this.expandAll();
      },
      error: (err) => {
        this.upcomingCompetitions = [];
        switch (err.status) {
          case 504:
            this.error = "Could not fetch upcoming competitions. The server is not responding.";
            break;
          default:
            this.error = "Could not fetch upcoming competitions. Please try again later.";
            break;
        }
      }
    });
  }

  expandAll() {
    this.upcomingCompetitions.forEach(comp => {
      comp.showDetails = true;
    });
  }

  collapseAll() {
    this.upcomingCompetitions.forEach(comp => {
      comp.showDetails = false;
    });
  }

  showNotificationSetup() {
    return this.authService.isLoggedIn();
  }

  showLoginMessage() {
    return !this.authService.isLoggedIn();
  }

  toggleShowComp(comp: Competition, event: Event) {
    event.preventDefault();
    comp.showDetails = !comp.showDetails;
  }

  getCompetitionLink(comp: Competition) {
    return this.wcaLinkService.toCompetition(comp.registrationName);
  }

  getCompetitionRegistrationLink(comp: Competition) {
    return this.wcaLinkService.toCompetitionRegistration(comp.registrationName);
  }
}
