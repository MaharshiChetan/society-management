import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private _toastrService: NbToastrService) {}

  showToast(position: any, status: any, title: string, message: string) {
    this._toastrService.show(message, title, {
      position,
      status,
      duration: 4000,
    });
  }
}
