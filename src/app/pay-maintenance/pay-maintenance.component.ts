import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { MaintenanceService } from '../services/maintenance.service';
import { AuthService } from '../services/auth.service';
import { OwnerService } from '../services/owner.service';
import { NbDialogService } from '@nebular/theme';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-pay-maintenance',
  templateUrl: './pay-maintenance.component.html',
  styleUrls: ['./pay-maintenance.component.scss'],
})
export class PayMaintenanceComponent implements OnInit {
  currentUser: any;
  maintenanceDetails: { key: string }[];
  loading: boolean = true;
  payableMaintenance: any;
  constructor(
    private _maintenanceService: MaintenanceService,
    private _authService: AuthService,
    private _ownerService: OwnerService,
    private cd: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private _toastService: ToastService
  ) {}

  ngOnInit() {
    this.getMaintenance();
    this.getCurrentUserDetails();
  }

  refresh() {
    this.cd.detectChanges();
  }

  getCurrentUserDetails() {
    this._authService.getAuthState().subscribe(state => {
      if (state) {
        const subscription = this._ownerService.getOwnerByUID(state.uid).subscribe((owner: any) => {
          const flatOwnerSubcription = this._ownerService
            .getOwnerByFlatNumber(owner.flatNumber)
            .subscribe(currentUser => {
              flatOwnerSubcription.unsubscribe();
              this.currentUser = currentUser;
              this.loading = false;
              this.refresh();
            });
          subscription.unsubscribe();
        });
      }
    });
  }

  getMaintenance() {
    const maintenanceSubscription = this._maintenanceService.getMaintenance().subscribe(data => {
      console.log(data);
      this.maintenanceDetails = data;
      maintenanceSubscription.unsubscribe();
    });
  }

  makePayment(ref: any) {
    this.loading = true;
    this._maintenanceService
      .payMaintenance(this.currentUser.flatNumber, this.payableMaintenance)
      .then(() => {
        this.getCurrentUserDetails();
        this._toastService.showToast(
          'top-right',
          'success',
          'Success',
          'Payment for maintenance is paid Successfully!.'
        );
        this.payableMaintenance = '';
        ref.close();
      })
      .catch(e => {
        console.log(e);
        this._toastService.showToast(
          'top-right',
          'danger',
          'Failed',
          'Payment for maintenance is not paid Successfully!.'
        );
        this.payableMaintenance = '';
        ref.close();
      });
  }

  makePaymentDialog(dialog: TemplateRef<any>, maintenance: any) {
    this.dialogService.open(dialog, { context: 'Are you sure for making the payment?' });
    this.payableMaintenance = maintenance;
    console.log(this.payableMaintenance);
  }
}
