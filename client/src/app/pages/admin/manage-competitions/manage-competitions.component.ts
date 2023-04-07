import { Component } from '@angular/core';
import { ModalService } from 'src/app/components/modal/modal.service';
import { Competition, CompetitionService } from 'src/app/services/competition/competition.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './manage-competitions.component.html',
  styleUrls: ['./manage-competitions.component.less']
})
export class ManageCompetitionsComponent {

  competitions: Competition[] = [];
  selectedCompetition: Competition;
  searchFilter: string = "";
  today: Date;

  constructor(
    private compService: CompetitionService,
    private modalService: ModalService
  ) {
    this.selectedCompetition = this.compService.getBlankCompetition();
    this.fetchCompetitions();
    this.today = new Date();
  }

  fetchCompetitions() {
    this.compService.getAllCompetitions()
    .subscribe({
      next: (competitions) => {
        this.competitions = competitions;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getFilteredCompetitions() {
    const searchFilter = this.searchFilter.toLowerCase();
    
    let comps = this.competitions.filter(comp => 
      comp.name.toLowerCase().includes(searchFilter) ||
      comp.address.toLowerCase().includes(searchFilter) ||
      comp.venue?.toLowerCase().includes(searchFilter) ||
      comp.city?.toLowerCase().includes(searchFilter) ||
      comp.province?.toLowerCase().includes(searchFilter) ||
      comp.registrationName.toLowerCase().includes(searchFilter)
    );

    comps.sort(function (a, b) {      
      return a.startDate > b.startDate ? -1 : 1;
    });

    return comps;
  }

  isOld(comp: Competition) {
    return comp.endDate < this.today;
  }

  startAddCompetition() {
    console.log("Add competition");
    this.selectedCompetition = this.compService.getBlankCompetition();
    this.modalService.open("comp-edit-modal");
  }

  startEditCompetition(comp: Competition) {
    console.log("Edit competition: " + comp.name);
    
    this.selectedCompetition = comp;
    this.modalService.open("comp-edit-modal");
  }

  closeEditModal() {
    this.modalService.close("comp-edit-modal");
  }

  startSendNotifications(comp: Competition) {
    this.selectedCompetition = comp;
    this.modalService.open("comp-send-notifications-modal");
  }

  closeSendNotificationsModal() {
    this.modalService.close("comp-send-notifications-modal");
  }

  sendNotifications() {

    this.compService.sendNotifications(this.selectedCompetition)
    .subscribe({
      next: () => {
        console.log("Notifications sent");
      }
    });

    this.closeSendNotificationsModal();
  }

  startDeleteCompetition(comp: Competition) {
    this.selectedCompetition = comp;
    this.modalService.open("comp-delete-confirm-modal");
  }

  closeConfirmDeleteModal() {
    this.modalService.close("comp-delete-confirm-modal");
  }

  deleteSelectedCompetition() {
    if (this.selectedCompetition) {
      this.compService.deleteCompetition(this.selectedCompetition._id)
      .subscribe({
        next: () => {
          this.fetchCompetitions();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    this.closeConfirmDeleteModal();
  }

  saveCompetition(comp: Competition) {
    console.log("Save selected competition", comp);
    let request;
    if (comp._id === "") {
      // New competition
      request = this.compService.addCompetition(comp);
    } else {
      // Existing competition
      request = this.compService.updateCompetition(comp);
    }
    request.subscribe({
      next: () => {
        this.fetchCompetitions();
      }
    });
  }

}
