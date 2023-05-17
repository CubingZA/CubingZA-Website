import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  currentSelection: ProvinceSelection;
  unsavedChanges: boolean;

  provinceNameMap: ProvinceNameMap = {
    none:'No province',
    GT:'Gauteng',
    MP:'Mpumalanga',
    LM:'Limpopo',
    NW:'North West',
    FS:'Free State',
    KZ:'KwaZulu Natal',
    EC:'Eastern Cape',
    WC:'Western Cape',
    NC:'Northern Cape',
    other:'Other country',
  };

  constructor(private http: HttpClient) {
    this.currentSelection = this.getBlankSelection();
    this.fetchProvinceSelection();
    this.unsavedChanges = false;
  }

  getAvailableProvinces(): string[] {
    const keys = Object.keys(this.getBlankSelection());
    return keys.map((key: string) => this.provinceNameMap[key as keyof ProvinceSelection]);
  }

  getAvailableProvincesWithNoneAndOther(): string[] {
    return Object.values(this.provinceNameMap);
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
      NC: false,
    };
  }

  unselectAll() {
    this.unsavedChanges = true;
    this.currentSelection = this.getBlankSelection();
  }

  hasUnsavedChanges(): boolean {
    return this.unsavedChanges;
  }

  getProvinceSelection(): ProvinceSelection {
    return this.currentSelection;
  }

  getSelectedProvinces(): (keyof ProvinceSelection)[] {
    let selected: (keyof ProvinceSelection)[] = [];
    for (let p in this.provinceNameMap) {
      if (this.currentSelection[p as keyof ProvinceSelection]) {
        selected.push(p as keyof ProvinceSelection);
      }
    }
    return selected.sort();
  }

  getProvinceName(key: keyof ProvinceSelection): string {
    return this.provinceNameMap[key];
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
  other: string;
  none: string;
}