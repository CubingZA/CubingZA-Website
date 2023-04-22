import { Component } from '@angular/core';
import { ProvinceService, ProvinceSelection } from 'src/app/services/province/province.service';

@Component({
  selector: 'app-province-map',
  templateUrl: './province-map.component.html',
  styleUrls: ['./province-map.component.less']
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
