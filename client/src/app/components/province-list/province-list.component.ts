import { Component } from '@angular/core';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';

import { ProvinceService } from 'src/app/services/province/province.service';

import { ProvinceSelection } from 'src/app/interfaces/user/province-selection';

@Component({
  selector: 'app-province-list',
  templateUrl: './province-list.component.html',
  styleUrls: ['./province-list.component.less']
})
export class ProvinceListComponent {

  faCircleMinus = faCircleMinus;

  constructor(
    private provinceService: ProvinceService
  ) { }

  getSelectedProvinces(): string[] {
    const selection = this.provinceService.getProvinceSelection();
    let keys: string[] = [];
    for (let p in selection) {
      if (selection[p as keyof ProvinceSelection]) {
        keys.push(p as string);
      }
    }
    return keys.sort();
  }

  toggleProvince(key: string) {
    this.provinceService.toggleProvince(key as keyof ProvinceSelection);
  }

  getProvinceName(key: string): string {
    return this.provinceService.getProvinceName(key as keyof ProvinceSelection);
  }
}
