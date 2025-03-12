import { Component } from '@angular/core';
import { WcaLinkService } from 'src/app/services/wca-link/wca-link.service';

@Component({
    selector: 'app-links-box',
    templateUrl: './links-box.component.html',
    styleUrls: ['./links-box.component.less'],
    standalone: false
})
export class LinksBoxComponent {

  constructor(
    private wcaLinkService: WcaLinkService
  ) { }

  getWCAHomePageLink(): string {
    return this.wcaLinkService.toHome();
  }

}
