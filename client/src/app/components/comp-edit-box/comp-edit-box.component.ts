import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faCloudArrowUp, faBan } from '@fortawesome/free-solid-svg-icons';

import { Competition, CompetitionService } from 'src/app/services/competition/competition.service';
import { ProvinceService } from 'src/app/services/province/province.service';

@Component({
  selector: 'app-comp-edit-box',
  templateUrl: './comp-edit-box.component.html',
  styleUrls: ['./comp-edit-box.component.less']
})
export class CompEditBoxComponent {

  faCloudArrowUp = faCloudArrowUp;
  faBan = faBan;

  private _competition: Competition;

  @Input() set competition(comp: Competition) {
    this._competition = comp;

    this.compName.setValue(comp.name);
    this.registrationName.setValue(comp.registrationName);
    this.venue.setValue(comp.venue);
    this.address.setValue(comp.address);
    this.city.setValue(comp.city);
    this.province.setValue(comp.province);

    const startDate = comp.startDate.toISOString().substring(0, 10);
    const endDate = comp.endDate.toISOString().substring(0, 10);

    this.startDate.setValue(startDate);
    this.endDate.setValue(endDate);
    this.multiDay.setValue(startDate !== endDate);
  }
  get competition(): Competition {
    return this._competition;
  }

  @Input() saveFn: (comp: Competition)=>void = ()=>{};
  @Input() closeFn: ()=>void = ()=>{};

  @Input() title: string = 'Edit Competition';

  form: FormGroup = new FormGroup({
    compName: new FormControl('', [Validators.required]),
    registrationName: new FormControl('', [Validators.required]),
    venue: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    startDate: new FormControl((new Date()).toISOString().substring(0, 10), [Validators.required]),
    endDate: new FormControl((new Date()).toISOString().substring(0, 10)),
    multiDay: new FormControl(false, [Validators.required])
  });

  constructor(
    private provinceService: ProvinceService,
    private compService: CompetitionService
  ) {
    this._competition = this.compService.getBlankCompetition();
  }

  get compName(): FormControl { return this.form.get('compName') as FormControl; }
  get registrationName(): FormControl { return this.form.get('registrationName') as FormControl; }
  get venue(): FormControl { return this.form.get('venue') as FormControl; }
  get address(): FormControl { return this.form.get('address') as FormControl; }
  get city(): FormControl { return this.form.get('city') as FormControl; }
  get province(): FormControl { return this.form.get('province') as FormControl; }
  get startDate(): FormControl { return this.form.get('startDate') as FormControl; }
  get endDate(): FormControl { return this.form.get('endDate') as FormControl; }
  get multiDay(): FormControl { return this.form.get('multiDay') as FormControl; }

  getProvinces() {
    return this.provinceService.getAvailableProvinces();
  }

  close() {
    this.form.reset();
    this._competition = this.compService.getBlankCompetition();
    this.closeFn();
  }

  handleOK() {
    if (this.form.valid) {
      this.competition.name = this.compName.value;
      this.competition.registrationName = this.registrationName.value;
      this.competition.venue = this.venue.value;
      this.competition.address = this.address.value;
      this.competition.city = this.city.value;
      this.competition.province = this.province.value;
      this.competition.startDate = new Date(this.startDate.value);
      if (this.multiDay.value) {
        this.competition.endDate = new Date(this.endDate.value);
      } else {
        this.competition.endDate = new Date(this.startDate.value);
      }
    }

    this.saveFn(this.competition);
    this.closeFn();
  }

}
