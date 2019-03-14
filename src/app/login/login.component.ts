import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OwnerService } from '../services/owner.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  constructor(
    private authService: AuthService,
    private ownerService: OwnerService,
    private toastService: ToastService,
    private cd: ChangeDetectorRef,
    private _router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  refresh() {
    this.cd.detectChanges();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  adminLogin() {
    this.loading = true;
    const { email, password } = this.loginForm.value;
    const smallEmail = email.split('@')[0];
    const subscription = this.ownerService
      .checkOwnerExistenceWithEmail(smallEmail)
      .subscribe((owner: any) => {
        if (owner && owner.password === password && owner.email === email && owner.admin) {
          subscription.unsubscribe();
          this.authService
            .signup(email, password)
            .then((currentUser: any) => {
              this.loading = false;
              this.refresh();
              this.ownerService.createOwnerWithUID(currentUser.user.uid, owner);
              this.showToast('success');
              this.loginForm.reset();
              this._router.navigate(['/dashboard']);
            })
            .catch(e => {
              if (e.code === 'auth/email-already-in-use') {
                this.authService
                  .login(email, password)
                  .then((currentUser: any) => {
                    subscription.unsubscribe();
                    this.loading = false;
                    this.refresh();
                    this.ownerService.createOwnerWithUID(currentUser.user.uid, owner);
                    this.showToast('success');
                    this.loginForm.reset();
                    this._router.navigate(['/dashboard']);
                  })
                  .catch(e => {
                    subscription.unsubscribe();
                    this.loading = false;
                    this.refresh();
                    this.showToast('fail');
                  });
              } else {
                subscription.unsubscribe();
                this.loading = false;
                this.refresh();
                this.showToast('fail');
              }
            });
        } else {
          subscription.unsubscribe();
          this.loading = false;
          this.refresh();
          this.showToast('fail');
        }
      });
  }

  residentLogin() {
    this.loading = true;
    const { email, password } = this.loginForm.value;
    const smallEmail = email.split('@')[0];
    const subscription = this.ownerService
      .checkOwnerExistenceWithEmail(smallEmail)
      .subscribe((owner: any) => {
        if (owner && owner.password === password && owner.email === email && !owner.admin) {
          subscription.unsubscribe();
          this.authService
            .signup(email, password)
            .then((currentUser: any) => {
              this.loading = false;
              this.refresh();
              this.ownerService.createOwnerWithUID(currentUser.user.uid, owner);
              this.showToast('success');
              this.loginForm.reset();
              this._router.navigate(['/pay-maintenance']);
            })
            .catch(e => {
              if (e.code === 'auth/email-already-in-use') {
                this.authService
                  .login(email, password)
                  .then((currentUser: any) => {
                    subscription.unsubscribe();
                    this.loading = false;
                    this.refresh();
                    this.ownerService.createOwnerWithUID(currentUser.user.uid, owner);
                    this.showToast('success');
                    this.loginForm.reset();
                    this._router.navigate(['/pay-maintenance']);
                  })
                  .catch(e => {
                    subscription.unsubscribe();
                    this.loading = false;
                    this.refresh();
                    this.showToast('fail');
                  });
              } else {
                subscription.unsubscribe();
                this.loading = false;
                this.refresh();
                this.showToast('fail');
              }
            });
        } else {
          subscription.unsubscribe();
          this.loading = false;
          this.refresh();
          this.showToast('fail');
        }
      });
  }

  showToast(type: string, message?: string) {
    if (type === 'fail') {
      this.toastService.showToast(
        'top-right',
        'danger',
        'Failed',
        message || 'Please check your login details!'
      );
    } else {
      this.toastService.showToast(
        'top-right',
        'success',
        'Success',
        message || 'You have logged in Successfully!.'
      );
    }
  }
}
