import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private http: HttpClient) { }

  getRecords() {
    return this.http.get<Record[]>('/api/records');
  }
}

export type Record = {
  eventName: string;
  eventId: string;
  singleName: string;
  singleResult: string;
  singleId: string;
  singleDate: Date;
  averageName: string;
  averageResult: string;
  averageId: string;
  averageDate: Date;
  eventRank: number;
};