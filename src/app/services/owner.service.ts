import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  constructor(private _firebaseDatabase: AngularFireDatabase) {}

  async createOwnerWithFlatAndEmail(owner: any) {
    const email = owner.email.split('@')[0];
    try {
      await this._firebaseDatabase.object(`apartmentOwnersWithFlat/${owner.flatNumber}`).set(owner);
      await this._firebaseDatabase.object(`apartmentOwnersWithEmail/${email}`).set(owner);
    } catch (e) {
      console.log(e);
    }
  }

  async createOwnerWithUID(uid: string, owner: string) {
    try {
      await this._firebaseDatabase.object(`owners/${uid}`).update(owner);
    } catch (e) {
      console.log(e);
    }
  }

  async removeOwner(flatNumber: string | number, email: string, uid?: string) {
    email = email.split('@')[0];
    try {
      await this._firebaseDatabase.object(`apartmentOwnersWithFlat/${flatNumber}`).remove();
      await this._firebaseDatabase.object(`apartmentOwnersWithEmail/${email}`).remove();
      if (uid) {
        await this._firebaseDatabase.object(`owners/${uid}`).remove();
      }
      console.log('success');
    } catch (e) {
      console.log(e);
    }
  }

  async updateOwner(owner: any, flatNumber: string | number, email: string) {
    email = email.split('@')[0];
    try {
      await this._firebaseDatabase.object(`apartmentOwnersWithFlat/${flatNumber}`).update(owner);
      await this._firebaseDatabase.object(`apartmentOwnersWithEmail/${email}`).update(owner);
      console.log('success');
    } catch (e) {
      console.log(e);
    }
  }

  getAllOwners() {
    return this._firebaseDatabase
      .list('apartmentOwnersWithFlat')
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  checkOwnerExistenceWithFlatNumber(flatNumber: string | number) {
    return this._firebaseDatabase.object(`apartmentOwnersWithFlat/${flatNumber}`).valueChanges();
  }

  checkOwnerExistenceWithEmail(email: string) {
    return this._firebaseDatabase.object(`apartmentOwnersWithEmail/${email}`).valueChanges();
  }

  getOwnerByUID(uid: string) {
    return this._firebaseDatabase.object(`owners/${uid}`).valueChanges();
  }

  getOwnerByFlatNumber(flatNumber: string | number) {
    return this._firebaseDatabase.object(`apartmentOwnersWithFlat/${flatNumber}`).valueChanges();
  }
}
