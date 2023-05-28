import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WcaLinkService {

  private readonly baseUrl = 'https://www.worldcubeassociation.org';

  constructor() { }

  toHome(): string {
    return this.baseUrl;
  }

  toPerson(wcaId: string): string {
    return `${this.baseUrl}/persons/${wcaId}`;
  }

  toRankings(eventId: string, type: string): string {
    return `${this.baseUrl}/results/rankings/${eventId}/${type}?region=South%2BAfrica`;
  }

  toRecords(eventId: string): string {
    return `${this.baseUrl}/results/records?event_id=${eventId}&region=South%2BAfrica&show=mixed%20history`;
  }

  toCompetition(compId: string): string {
    return `${this.baseUrl}/competitions/${compId}`;
  }

  toCompetitionRegistration(compId: string): string {
    return `${this.baseUrl}/competitions/${compId}/register`;
  }

}
