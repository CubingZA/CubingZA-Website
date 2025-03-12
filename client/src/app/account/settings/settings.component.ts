import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import { UserService } from 'src/app/services/user/user.service';
import { PasswordMatchValidator } from '../password.validator';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertsService } from 'src/app/components/alerts/alerts.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.less'],
    standalone: false
})
export class SettingsComponent {

}
