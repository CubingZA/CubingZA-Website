import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  currentSelection: ProvinceSelection;
  unsavedChanges: boolean;

  provinces: ProvinceNameMap = {
    GT:'Gauteng',
    MP:'Mpumalanga',
    LM:'Limpopo',
    NW:'North West',
    FS:'Free State',
    KZ:'KwaZulu Natal',
    EC:'Eastern Cape',
    WC:'Western Cape',
    NC:'Northern Cape'
  };

  constructor(private http: HttpClient) {
    this.currentSelection = this.getBlankSelection();
    this.fetchProvinceSelection();
    this.unsavedChanges = false;
  }

  getAvailableProvinces(): string[] {
    return Object.values(this.provinces);
  }

  getBlankSelection(): ProvinceSelection {
    return {
      GT: false,
      MP: false,
      LM: false,
      NW: false,
      FS: false,
      KZ: false,
      EC: false,
      WC: false,
      NC: false
    };
  }

  unselectAll() {
    this.unsavedChanges = true;
    this.currentSelection = this.getBlankSelection();
  }

  getProvinceSelection(): ProvinceSelection {
    return this.currentSelection;
  }

  getSelectedProvinces(): (keyof ProvinceSelection)[] {
    let selected: (keyof ProvinceSelection)[] = [];
    for (let p in this.provinces) {
      if (this.currentSelection[p as keyof ProvinceSelection]) {
        selected.push(p as keyof ProvinceSelection);
      }
    }
    return selected.sort();
  }

  getProvinceName(key: keyof ProvinceSelection): string {
    return this.provinces[key];
  }

  toggleProvince(province: keyof ProvinceSelection) {
    this.unsavedChanges = true;
    this.currentSelection[province] = !this.currentSelection[province];
  }

  fetchProvinceSelection() {
    this.http.get<ProvinceSelection>('/api/users/me/notifications')
    .subscribe((provinceSelection) => {
      this.currentSelection = provinceSelection;
    });
  }

  resetProvinceSelection() {
    this.fetchProvinceSelection();
    this.unsavedChanges = false;
  }

  saveProvinceSelection() {
    let request = this.http.post('/api/users/me/notifications', this.currentSelection)

    .pipe(
      map(() => {
        this.unsavedChanges = false;
      }),
      catchError((error) => {
        throw new Error("Error saving notifications");
      })
    )

    return request;
  }

}

export type ProvinceSelection = {
  GT: boolean;
  MP: boolean;
  LM: boolean;
  NW: boolean;
  FS: boolean;
  KZ: boolean;
  EC: boolean;
  WC: boolean;
  NC: boolean;
}

export type ProvinceNameMap = {
  GT: string;
  MP: string;
  LM: string;
  NW: string;
  FS: string;
  KZ: string;
  EC: string;
  WC: string;
  NC: string;
}