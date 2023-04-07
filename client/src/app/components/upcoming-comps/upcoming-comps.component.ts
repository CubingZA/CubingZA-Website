import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Competition, CompetitionService } from 'src/app/services/competition/competition.service';

@Component({
  selector: 'app-upcoming-comps',
  templateUrl: './upcoming-comps.component.html',
  styleUrls: ['./upcoming-comps.component.less']
})
export class UpcomingCompsComponent {
  
  upcomingCompetitions: Competition[];

  constructor(private authService: AuthService, private compService: CompetitionService) {
    this.upcomingCompetitions = [];
    this.updateUpcomingCompetitions();
  }

  updateUpcomingCompetitions() {
    this.compService.getUpcomingCompetitions()
    .subscribe({
      next: (data: Competition[]) => {
        this.upcomingCompetitions = data;
      }
    });
  }

  showNotificationSetup() {
    return this.authService.isLoggedIn();
  }

  showLoginMessage() {
    return !this.authService.isLoggedIn();
  }

  toggleShowComp(comp: Competition) {    
    comp.showDetails = !comp.showDetails;
  }
}
