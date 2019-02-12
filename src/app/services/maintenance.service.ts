import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  constructor(private _firebaseDatabase: AngularFireDatabase) {}

  async createMaintenance(amount: any, date: any) {
    try {
      await this._firebaseDatabase.list('maintenance').push({ amount, date });
    } catch (e) {
      console.log(e);
    }
  }

  getMaintenance() {
    return this._firebaseDatabase
      .list('maintenance')
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  payMaintenance(flatNumber: string | number, maintenance: any) {
    return this._firebaseDatabase
      .object(`apartmentOwnersWithFlat/${flatNumber}/maintenance/${maintenance.key}`)
      .update(maintenance);
  }
}
