import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OwnerService } from '../services/owner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-create-owner',
  templateUrl: './create-owner.component.html',
  styleUrls: ['./create-owner.component.scss'],
})
export class CreateOwnerComponent implements OnInit {
  createOwnerForm: FormGroup;
  mode: string;
  ownerDetails: any;
  loading: boolean = false;
  emailExistenceSubscription: any;
  flatNumberExistenceSubscription: any;

  constructor(
    private _ownerService: OwnerService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._route.queryParams.subscribe(owner => {
      this.ownerDetails = owner;
      if (owner.flatNumber) {
        this.mode = 'edit';
        this.createForm(owner);
        return;
      } else {
        this.createForm();
      }
    });
  }

  refresh() {
    this.cd.detectChanges();
  }

  createForm(owner?: any) {
    if (owner) {
      this.createOwnerForm = new FormGroup({
        flatNumber: new FormControl(owner.flatNumber, Validators.required),
        blockName: new FormControl(owner.blockName, Validators.required),
        fullName: new FormControl(owner.fullName, Validators.required),
        phoneNumber: new FormControl(owner.phoneNumber, Validators.required),
        email: new FormControl(owner.email, [Validators.required, Validators.email]),
        password: new FormControl(owner.password, [Validators.required, Validators.minLength(6)]),
        parkingType: new FormControl(owner.parkingType || ''),
        parkingNumber: new FormControl(owner.parkingNumber || ''),
      });
    } else {
      this.createOwnerForm = new FormGroup({
        flatNumber: new FormControl('', Validators.required),
        blockName: new FormControl('', Validators.required),
        fullName: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        parkingType: new FormControl(''),
        parkingNumber: new FormControl(''),
      });
    }
  }

  createOwner() {
    this.loading = true;
    const ownerDetails = this.createOwnerForm.value;
    this.flatNumberExistenceSubscription = this._ownerService
      .checkOwnerExistenceWithFlatNumber(ownerDetails.flatNumber)
      .subscribe(data => {
        this.flatNumberExistenceSubscription.unsubscribe();
        if (data) {
          this.stopLoading();
          this.showToast('fail', 'Flat number already exists.');
        } else {
          const email = ownerDetails.email.split('@')[0];
          this.emailExistenceSubscription = this._ownerService
            .checkOwnerExistenceWithEmail(email)
            .subscribe(data => {
              this.emailExistenceSubscription.unsubscribe();
              if (data) {
                this.stopLoading();
                this.showToast('fail', 'Email already exists.');
              } else {
                this._ownerService
                  .createOwnerWithFlatAndEmail(ownerDetails)
                  .then(data => {
                    console.log('Success');
                    this.showToast(
                      'success',
                      `Registered user successfully with Email: ${ownerDetails.email}`
                    );
                    this.createOwnerForm.reset();
                    this.stopLoading();
                  })
                  .catch(e => {
                    console.log('Error: ', e);
                    this.showToast('fail', 'Something went wrong!');
                    this.stopLoading();
                  });
              }
            });
        }
      });
  }

  updateOwner() {
    this.loading = true;
    const ownerDetails = this.createOwnerForm.value;
    if (this.ownerDetails.flatNumber != ownerDetails.flatNumber) {
      this.flatNumberExistenceSubscription = this._ownerService
        .checkOwnerExistenceWithFlatNumber(ownerDetails.flatNumber)
        .subscribe(data => {
          this.flatNumberExistenceSubscription.unsubscribe();
          if (data) {
            console.log(data);
            this.showToast('fail');
            this.stopLoading();
          } else {
            this.removeOwner();
            this.updateOwnerDetails(ownerDetails).then(() => {
              this._router.navigate(['view-owners']);
              this.stopLoading();
            });
          }
        });
    } else if (this.ownerDetails.email !== ownerDetails.email) {
      const email = ownerDetails.email.split('@')[0];
      console.log('hello');

      this.emailExistenceSubscription = this._ownerService
        .checkOwnerExistenceWithEmail(email)
        .subscribe(data => {
          this.emailExistenceSubscription.unsubscribe();
          if (data) {
            this.stopLoading();
            this.showToast('fail', 'Email already exists.');
          } else {
            this.removeOwner();
            this.updateOwnerDetails(ownerDetails).then(() => {
              this._router.navigate(['view-owners']);
              this.stopLoading();
            });
          }
        });
    } else {
      this.updateOwnerDetails(ownerDetails).then(() => {
        this._router.navigate(['view-owners']);
        this.stopLoading();
      });
    }
  }

  removeOwner() {
    this._ownerService.removeOwner(this.ownerDetails.flatNumber, this.ownerDetails.email);
  }

  async updateOwnerDetails(ownerDetails: any) {
    return this._ownerService
      .updateOwner(ownerDetails, ownerDetails.flatNumber, ownerDetails.email)
      .then(data => {
        console.log('Success');
        this.showToast('success', `Registered user successfully with Email: ${ownerDetails.email}`);
        this.createOwnerForm.reset();
      })
      .catch(e => {
        console.log('Error: ', e);
        this.showToast('fail', 'Something went wrong!');
      });
  }

  showToast(type: string, message?: string) {
    if (type === 'fail') {
      this._toastService.showToast(
        'top-right',
        'danger',
        'Failed',
        message || 'Flat number already exists.'
      );
    } else {
      this._toastService.showToast(
        'top-right',
        'success',
        'Success',
        message || 'You have logged in Successfully!.'
      );
    }
  }

  stopLoading() {
    this.loading = false;
    this.refresh();
  }
}
