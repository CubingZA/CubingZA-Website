import { Component } from '@angular/core';
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

  province: string = "No province";

  private originalProvince: string = "No province";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private provinceService: ProvinceService,
    private alerts: AlertsService
  ) { }

  ngOnInit(): void {
    const user = this.authService.updateCurrentUser().subscribe({
      next: user => {
        if (user) {
          this.province = user.homeProvince ?
          this.provinceService.getProvinceName(user.homeProvince as keyof ProvinceSelection) :
          "No province";
          this.originalProvince = this.province;
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

  updateProvince() {
    this.alerts.clear();
    if (this.province !== this.originalProvince) {
      this.userService.updateHomeProvince(this.province)
      .subscribe({
        next: res => {
          this.alerts.addAlert("success", "Province updated successfully");
          this.originalProvince = this.province;
        },
        error: err => {
          this.alerts.addAlert("danger", "Error updating province");
          console.log(err);
        }
      });
    }
  }

  provinceHasRankings(): boolean {
    return this.provinceService.getAvailableProvinces().includes(this.province);
  }

}
