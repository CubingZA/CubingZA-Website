import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private http: HttpClient
  ) { }

  getRecords() {
    return this.http.get<Record[]>('/api/records')
    .pipe(
      tap(records => {
        return records.map(record => {
          record.singleDate = new Date(record.singleDate);
          record.averageDate = new Date(record.averageDate);
          return record;
        });
      })
    );
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