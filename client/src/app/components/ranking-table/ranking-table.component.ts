import { Component, Input, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EventsService } from 'src/app/services/events/events.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { Ranking, ProvincialRankingsService } from 'src/app/services/provincial-rankings/provincial-rankings.service';
import { AlertsService } from '../alerts/alerts.service';
import { WcaLinkService } from 'src/app/services/wca-link/wca-link.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.less']
})
export class RankingTableComponent {

  @Input() province: string = 'GT';
  @Input() event: string = '333';
  @Input() type: string = 'single';

  rankings: Ranking[] = [];
  count: number = 0;
  page: number = 1;

  private ranksRequest?: Observable<Ranking[]>;
  private countsRequest?: Observable<number>;

  constructor(
    private provinceService: ProvinceService,
    private rankingsService: ProvincialRankingsService,
    private eventService: EventsService,
    private wcaLinkService: WcaLinkService,
    private titleService: Title,
    private alerts: AlertsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updatePageFromQuery();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const provinceChange = changes['province'];
    const eventChange = changes['event'];
    const typeChange = changes['type'];

    if (provinceChange?.previousValue || eventChange?.previousValue || typeChange?.previousValue) {
      this.page = 1;
      this.updateLocation();
    }

    this.updateCount();
    this.updateRankings();

    const provinceName = this.provinceService.getProvinceName(this.province);
    const eventName = this.eventService.getEventName(this.event);
    const typeName = this.type === 'single' ? 'Single' : 'Average';
    this.titleService.setTitle(`${provinceName} Rankings - ${eventName} ${typeName} | CubingZA`);
  }

  getRankings(): Ranking[] {
    return this.rankings;
  }

  isTie(row: Ranking, i: number) {
    if (i === 0) {
      return false;
    }
    const prevRow = this.rankings[i - 1];
    return row.best === prevRow.best;
  }

  updateRankings(): void {
    this.alerts.clear();
    this.rankingsService.cancelPendingRankingRequests();
    this.ranksRequest = this.rankingsService.getRankings(this.event, this.province, this.type, this.page)

    this.ranksRequest.subscribe({
      next: (rankings: Ranking[]) => {
        this.rankings = rankings;
      },
      error: (err) => {
        this.alerts.addAlert("danger", "Error while fetch rankings froms server.");
      }
    });
  };

  updateCount(): void {
    this.alerts.clear();
    this.rankingsService.cancelPendingCountRequests();

    this.rankingsService.getRankingsCount(this.event, this.province, this.type).subscribe({
      next: (count: number) => {
        this.count = count;
      },
      error: (err) => {
        this.alerts.addAlert("danger", "Error while fetch rankings froms server.");
      }
    });
  }

  updatePageFromQuery(): void {
    const prevPage = this.page;
    this.route.queryParams.subscribe(params => {
      const page = parseInt(params['page']);
      if (page && page !== prevPage) {
        this.page = page;
        this.updateRankings();
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.updateRankings();
    this.updateLocation();
  }

  updateLocation(): void {
    this.router.navigate([
      'rankings', this.province, this.event, this.type
    ], {
      queryParams: {page: this.page},
      queryParamsHandling: 'merge',
    });
  }

  getLinkToPerson(personId: string): string {
    return this.wcaLinkService.toPerson(personId);
  }
}
