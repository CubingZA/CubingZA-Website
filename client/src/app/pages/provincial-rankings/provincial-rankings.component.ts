import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProvinceNameMap, ProvinceService } from 'src/app/services/province/province.service';
import { EventsService } from 'src/app/services/events/events.service';
import { CompEvent } from 'src/app/interfaces/competition/comp-event';

@Component({
    selector: 'app-rankings',
    templateUrl: './provincial-rankings.component.html',
    styleUrls: ['./provincial-rankings.component.less'],
    standalone: false
})
export class ProvincialRankingsComponent {

  @Input() province: string = 'GT';
  @Input() event: string = '333';
  @Input() type: string = 'single';

  provinces?: ProvinceNameMap;

  form: FormGroup = new FormGroup({
    province: new FormControl(this.province),
    event: new FormControl(this.event),
    type: new FormControl(this.type)
  });

  get provinceControl() { return this.form.get('province') as FormControl; }
  get eventControl() { return this.form.get('event') as FormControl; }
  get typeControl() { return this.form.get('type') as FormControl; }

  constructor(
    private provinceService: ProvinceService,
    private eventService: EventsService,
  ) { }

  ngOnInit(): void {
    this.provinces = this.getProvinces();

    this.provinceControl.valueChanges.subscribe((value) => {
      this.province = value;
    });
    this.eventControl.valueChanges.subscribe((value) => {
      this.event = value;
    });
    this.typeControl.valueChanges.subscribe((value) => {
      this.type = value;
    });
  }

  ngOnChanges(): void {
    this.updateForm();
  }

  updateForm(): void {
    this.provinceControl.setValue(this.province);
    this.eventControl.setValue(this.event);
    this.typeControl.setValue(this.type);
  }

  getProvinces(): ProvinceNameMap {
    return this.provinceService.getAvailableProvincesWithCodes();
  }

  getProvinceKeys(): string[] {
    if (!this.provinces) return [];
    return Object.keys(this.provinces);
  }

  getProvinceName(provinceCode: string): string {
    if (!this.provinces) return '';
    const name = this.provinces[provinceCode as keyof ProvinceNameMap];
    return name ? name : '';
  }

  getEvents(): CompEvent[] {
    return this.eventService.getEvents();
  }

}
