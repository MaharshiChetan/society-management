import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  uid: string;
  constructor(private _firebaseDatabase: AngularFireDatabase, private _authService: AuthService) {
    this._authService.getAuthState().subscribe(state => {
      if (state) {
        this.uid = state.uid;
      }
    });
  }

  async createRequest(request: any) {
    return await this._firebaseDatabase.list(`requests`).push(request);
  }

  async updateRequest(request: any, requestId: string) {
    return await this._firebaseDatabase.object(`requests/${requestId}`).update(request);
  }

  getAllRequests() {
    return this._firebaseDatabase
      .list('requests')
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  async removeRequest(requestId: string) {
    return await this._firebaseDatabase.object(`requests/${requestId}`).remove();
  }
}
