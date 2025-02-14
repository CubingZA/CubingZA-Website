import { Component } from '@angular/core';

import { ProvinceService } from 'src/app/services/province/province.service';

import { ProvinceSelection } from 'src/app/interfaces/user/province-selection';

@Component({
    selector: 'app-province-map',
    templateUrl: './province-map.component.html',
    styleUrls: ['./province-map.component.less'],
    standalone: false
})

export class ProvinceMapComponent {

  constructor(private provinceService: ProvinceService) {
    this.provinceService.getProvinceSelection()
  }

  isSelected(id: keyof ProvinceSelection) {
    const selection = this.provinceService.getProvinceSelection();
    return selection ? selection[id] : false;
  }

  handleClick(event: Event) {
    event.preventDefault();
    if (event.target) {
      const provinceElement : SVGPathElement = event.target as SVGPathElement;
      this.provinceService.toggleProvince(provinceElement.id as keyof ProvinceSelection)
    }
  }
}
