import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  uid: string;
  constructor(private _firebaseDatabase: AngularFireDatabase, private _authService: AuthService) {
    this._authService.getAuthState().subscribe(state => {
      if (state) {
        this.uid = state.uid;
      }
    });
  }

  async createNotice(notice: any) {
    return await this._firebaseDatabase.list('notices').push(notice);
  }

  async updateNotice(notice: any, noticeId: string) {
    return await this._firebaseDatabase.object(`notices/${noticeId}`).update(notice);
  }

  getAllNotices() {
    return this._firebaseDatabase
      .list('notices')
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  async removeNotice(noticeId: string) {
    return await this._firebaseDatabase.object(`notices/${noticeId}`).remove();
  }

  async likeNotice(noticeId: string) {
    await this._firebaseDatabase.object(`noticeLikes/${noticeId}`).update({ [this.uid]: true });
    this.removeDislikeFromNotice(noticeId);
  }

  async removeLikeFromNotice(noticeId: string) {
    await this._firebaseDatabase.object(`noticeLikes/${noticeId}/${this.uid}`).remove();
  }

  async dislikeNotice(noticeId: string) {
    await this._firebaseDatabase.object(`noticeDislikes/${noticeId}`).update({ [this.uid]: true });
    this.removeLikeFromNotice(noticeId);
  }

  async removeDislikeFromNotice(noticeId: string) {
    return await this._firebaseDatabase.object(`noticeDislikes/${noticeId}/${this.uid}`).remove();
  }

  checkLike(noticeId: string) {
    return this._firebaseDatabase.object(`noticeLikes/${noticeId}/${this.uid}`).valueChanges();
  }

  checkDislike(noticeId: string) {
    return this._firebaseDatabase.object(`noticeDislikes/${noticeId}/${this.uid}`).valueChanges();
  }

  getLikes(noticeId: string) {
    return this._firebaseDatabase
      .list(`noticeLikes/${noticeId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  getDislikes(noticeId: string) {
    return this._firebaseDatabase
      .list(`noticeDislikes/${noticeId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }
}
