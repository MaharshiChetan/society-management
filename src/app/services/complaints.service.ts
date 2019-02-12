import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  uid: string;
  constructor(private _firebaseDatabase: AngularFireDatabase, private _authService: AuthService) {
    this._authService.getAuthState().subscribe(state => {
      if (state) {
        this.uid = state.uid;
      }
    });
  }

  async createComplaint(complaint: any) {
    return await this._firebaseDatabase.list(`complaints`).push(complaint);
  }

  async updateComplaint(complaint: any, complaintId: string) {
    return await this._firebaseDatabase.object(`complaints/${complaintId}`).update(complaint);
  }

  getAllComplaints() {
    return this._firebaseDatabase
      .list('complaints')
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  async removeComplaint(complaintId: string) {
    return await this._firebaseDatabase.object(`complaints/${complaintId}`).remove();
  }
}
