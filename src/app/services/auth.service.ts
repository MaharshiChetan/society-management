import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<firebase.User>;
  authState: any = null;
  isAdmin: boolean;

  constructor(
    private _firebaseAuth: AngularFireAuth,
    private _firebaseDatabase: AngularFireDatabase
  ) {
    this.getAuthState().subscribe(auth => {
      this.authState = auth;
      if (auth) {
        this._firebaseDatabase
          .object(`owners/${auth.uid}`)
          .valueChanges()
          .subscribe((data: any) => {
            this.isAdmin = data.admin;
          });
      }
    });
    this.user = this.getAuthState();
  }

  signup(email: string, password: string) {
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    return await this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this._firebaseAuth.auth.signOut();
  }

  getAuthState() {
    return this._firebaseAuth.authState;
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user
  get currentUser(): any {
    return this.authenticated ? this.authState.auth : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  get isAdminOrRedisent(): boolean {
    return this.isAdmin;
  }
}
