import { Component } from '@angular/core';
import { faPlus, faEdit, faTrash, faEnvelope, faBan, faPaperPlane, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-regular-svg-icons';

import { ModalService } from 'src/app/components/modal/modal.service';
import { CompetitionService } from 'src/app/services/competition/competition.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

import { Competition } from 'src/app/interfaces/competition/competition';

@Component({
  selector: 'app-competitions',
  templateUrl: './manage-competitions.component.html',
  styleUrls: ['./manage-competitions.component.less']
})
export class ManageCompetitionsComponent {

  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faEnvelope = faEnvelope;
  faBan = faBan;
  faPaperPlane = faPaperPlane;
  faLocationDot = faLocationDot;
  faMap = faMap;
  faCalendar = faCalendar;

  competitions: Competition[] = [];
  selectedCompetition: Competition;
  searchFilter: string = "";
  today: Date;
  editModalTitle: string = "";

  constructor(
    private compService: CompetitionService,
    private modalService: ModalService,
    private alerts: AlertsService
  ) {
    this.selectedCompetition = this.compService.getBlankCompetition();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.fetchCompetitions();
  }

  fetchCompetitions() {
    this.alerts.clear();
    this.compService.getAllCompetitions()
    .subscribe({
      next: (competitions) => {
        this.competitions = competitions;
      },
      error: (err) => {
        console.log(err);
        this.alerts.addAlert("danger", "Failed to fetch competitions");
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
    this.selectedCompetition = this.compService.getBlankCompetition();
    this.editModalTitle = "Add Competition";
    this.modalService.open("comp-edit-modal");
  }

  startEditCompetition(comp: Competition) {
    this.selectedCompetition = comp;
    this.editModalTitle = "Edit Competition";
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
    this.alerts.clear();
    this.compService.sendNotifications(this.selectedCompetition)
    .subscribe({
      next: () => {
        console.log("Notifications sent");
      },
      error: (err) => {
        this.alerts.addAlert("danger", "Error while sending notifications");
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
    this.alerts.clear();
    if (this.selectedCompetition) {
      this.compService.deleteCompetition(this.selectedCompetition._id)
      .subscribe({
        next: () => {
          this.fetchCompetitions();
        },
        error: (err) => {
          this.alerts.addAlert("danger", "Error while deleting competition");
        }
      });
    }
    this.closeConfirmDeleteModal();
  }

  saveCompetition(comp: Competition) {
    this.alerts.clear();
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
      },
      error: (err) => {
        this.alerts.addAlert("danger", "Error while saving competition");
      }
    });
  }

}
