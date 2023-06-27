import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Ranking } from 'src/app/interfaces/ranking/ranking';

@Injectable({
  providedIn: 'root'
})
export class ProvincialRankingsService {

  private cancelRanking: Subject<void> = new Subject<void>();
  private cancelCount: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  getRankings(event: string, province: string, type: string, page?: number): Observable<Ranking[]> {
    let endPoint = `/api/rankings/${province}/${event}/${type}`
    if (page) {
      endPoint += `?page=${page}`;
    }
    return this.http.get<Ranking[]>(endPoint)
    .pipe(takeUntil(this.cancelRanking));
  }

  getRankingsCount(event: string, province: string, type: string): Observable<number> {
    return this.http.get<number>(`/api/rankings/${province}/${event}/${type}/count`)
    .pipe(takeUntil(this.cancelCount));
  }

  cancelPendingRankingRequests(): void {
    this.cancelRanking.next();
    this.cancelRanking.complete();
    this.cancelRanking = new Subject<void>();
  }

  cancelPendingCountRequests(): void {
    this.cancelCount.next();
    this.cancelCount.complete();
    this.cancelCount = new Subject<void>();
  }

}
