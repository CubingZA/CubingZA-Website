import { Component } from '@angular/core';

import { faGithub, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  faGithub = faGithub;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
}
