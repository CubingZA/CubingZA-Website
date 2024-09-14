import { Component } from '@angular/core';

import { faGithub, faFacebook, faInstagram, faYoutube, faDiscord } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  faGithub = faGithub;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faYoutube = faYoutube;
  faDiscord = faDiscord;
}
