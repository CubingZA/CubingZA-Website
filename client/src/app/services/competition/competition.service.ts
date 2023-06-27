import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { Competition } from 'src/app/interfaces/competition/competition';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  constructor(private http: HttpClient) { }

  getBlankCompetition(): Competition {
    return {
      _id: "",
      name: "",
      registrationName: "",
      address: "",
      venue: "",
      city: "",
      province: "",
      startDate: new Date(),
      endDate: new Date(),
    };
  }

  getUpcomingCompetitions() {
    return this.http.get<Competition[]>('/api/events/upcoming')
    .pipe(
      map(cleanCompDates),
      catchError((error) => {
        throw new Error("Error getting upcoming competitions");
      })
    );
  }

  getAllCompetitions() {
    return this.http.get<Competition[]>('/api/events')
    .pipe(
      map(cleanCompDates),
      catchError((error) => {
        throw new Error("Error getting all competitions");
      })
    );
  }

  deleteCompetition(id: string) {
    return this.http.delete(`/api/events/${id}`)
    .pipe(
      catchError((error) => {
        throw new Error("Error deleting competition");
      })
    );
  }

  addCompetition(comp: Competition) {
    return this.http.post('/api/events', comp)
    .pipe(
      catchError((error) => {
        throw new Error("Error adding competition");
      })
    );
  }

  updateCompetition(comp: Competition) {
    return this.http.put(`/api/events/${comp._id}`, comp)
    .pipe(
      catchError((error) => {
        throw new Error("Error updating competition");
      })
    );
  }

  sendNotifications(comp: Competition) {
    return this.http.post(`/api/events/${comp._id}/notify`, {})
    .pipe(
      catchError((error) => {
        throw new Error("Error sending notifications");
      })
    );
  }

}

function cleanCompDates(compList: Competition[]): Competition[] {
  compList.forEach(comp => {
    comp.startDate = new Date(comp.startDate);
    comp.endDate = new Date(comp.endDate);
  });
  return compList;
}
