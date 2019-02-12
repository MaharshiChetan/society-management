import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { OwnerService } from '../services/owner.service';
import { Router, NavigationExtras } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-view-owners',
  templateUrl: './view-owners.component.html',
  styleUrls: ['./view-owners.component.scss'],
})
export class ViewOwnersComponent implements OnInit {
  owners: any;
  deletableOwner: any;
  loading: boolean = true;
  ownerSubscription: any;
  constructor(
    private _ownerService: OwnerService,
    private _router: Router,
    private _dialogService: NbDialogService,
    private _toastService: ToastService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAllOwners();
  }

  refresh() {
    this.cd.detectChanges();
  }

  getAllOwners() {
    this.ownerSubscription = this._ownerService.getAllOwners().subscribe(owners => {
      this.loading = false;
      this.owners = owners;
      this.refresh();
      this.ownerSubscription.unsubscribe();
    });
  }

  editOwnerDetails(owner: any) {
    let ownerDetails: NavigationExtras = {
      queryParams: owner,
    };
    this._router.navigate(['/create-owner'], ownerDetails);
  }

  deleteOwner(ref: any) {
    this.loading = true;
    this._ownerService
      .removeOwner(this.deletableOwner.flatNumber, this.deletableOwner.email)
      .then(() => {
        ref.close();
        this._toastService.showToast(
          'top-right',
          'success',
          'Success',
          `Successfully deleted resident with Email: ${this.deletableOwner.email} and Password: ${
            this.deletableOwner.password
          }`
        );
        this.deletableOwner = '';
        this.getAllOwners();
      })
      .catch(e => {
        ref.close();
        this._toastService.showToast('top-right', 'danger', 'Failed', 'Something went wrong!');
        this.deletableOwner = '';
      });
  }

  showDialog(owner: any, dialog: TemplateRef<any>) {
    this.deletableOwner = owner;
    this._dialogService.open(dialog, { context: 'Are you sure for deleting the resident?' });
  }
}
