import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faInfoCircle, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProvinceSelection, ProvinceService } from 'src/app/services/province/province.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-province',
  templateUrl: './change-province.component.html',
  styleUrls: ['./change-province.component.less']
})
export class ChangeProvinceComponent {

  faInfoCircle = faInfoCircle;
  faTriangleExclamation = faTriangleExclamation;

  selectedProvince: string = "No province";

  private originalProvince: string = "No province";

  provinceForm: FormGroup = new FormGroup({
    province: new FormControl('No province')
  });
  get provinceDropdown(): FormControl { return this.provinceForm.get('province') as FormControl; }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private provinceService: ProvinceService,
    private alerts: AlertsService
  ) { }

  ngOnInit(): void {
    this.provinceForm.valueChanges.subscribe({
      next: this.updateProvince.bind(this)
    });

    this.authService.updateCurrentUser().subscribe({
      next: user => {
        if (user && user.homeProvince) {
          const selectedCode = user.homeProvince as keyof ProvinceSelection;
          this.selectedProvince = this.provinceService.getProvinceName(selectedCode);
          this.originalProvince = this.selectedProvince;
          this.provinceDropdown.setValue(this.selectedProvince);
        }
      }
    });
  }

  isWCAUser(): boolean {
    return this.authService.isWCAUser();
  }

  getProvinces(): string[] {
    return [
      ...this.provinceService.getAvailableProvincesWithNoneAndOther(),
    ];
  }

  updateProvince(): void {
    this.selectedProvince = this.provinceDropdown.value;

    this.alerts.clear();
    if (this.selectedProvince !== this.originalProvince) {
      this.userService.updateHomeProvince(this.selectedProvince)
      .subscribe({
        next: res => {
          this.alerts.addAlert("success", `Province updated to ${this.selectedProvince}.`);
          this.originalProvince = this.selectedProvince;
        },
        error: err => {
          this.alerts.addAlert("danger", "Error updating province");
        }
      });
    }
  }

  provinceHasRankings(): boolean {
    return this.provinceService.getAvailableProvinces().includes(this.selectedProvince);
  }

}
