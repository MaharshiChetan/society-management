import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NbDialogService, NbMenuService } from '@nebular/theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '../services/maintenance.service';
import { OwnerService } from '../services/owner.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit {
  maintenanceForm: FormGroup;
  ownerMaintenanceSubscription: any;
  loading: boolean = true;
  owners: any;
  totalPaid: number = 0;
  totalUnpaid: number = 0;
  items: any = [{ title: 'Profile' }, { title: 'Log out' }];
  month: string;
  maintenanceKey: string;
  constructor(
    private _dialogService: NbDialogService,
    private _maintenanceService: MaintenanceService,
    private _ownerService: OwnerService,
    private cd: ChangeDetectorRef,
    private nbMenuService: NbMenuService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getMaintenance();

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'date-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        this.month = title;
        this.refresh();
        this.items.forEach((item: any) => {
          if (item.title === title) {
            this.maintenanceKey = item.key;
            this.getAllOwners();
          }
        });
      });
  }

  refresh() {
    this.cd.detectChanges();
  }

  getAllOwners() {
    this.loading = true;
    console.log(this.maintenanceKey);
    this.totalPaid = 0;
    this.totalUnpaid = 0;
    this.ownerMaintenanceSubscription = this._ownerService.getAllOwners().subscribe(owners => {
      this.owners = owners;
      owners.forEach((owner: any, i) => {
        if (owner.maintenance && owner.maintenance[this.maintenanceKey]) {
          ++this.totalPaid;
        } else {
          ++this.totalUnpaid;
        }
      });
      this.loading = false;
      this.refresh();
      this.ownerMaintenanceSubscription.unsubscribe();
    });
  }

  createForm() {
    this.maintenanceForm = new FormGroup({
      amount: new FormControl('', Validators.required),
      date: new FormControl(new Date(), Validators.required),
    });
  }

  createMaintenanceDialog(dialog: TemplateRef<any>) {
    this._dialogService.open(dialog, { context: 'Fill up the form' });
  }

  createMaintenance(ref: any) {
    console.log(this.maintenanceForm.value);
    ref.close();
    const { amount, date } = this.maintenanceForm.value;
    console.log(date);
    this._maintenanceService
      .createMaintenance(amount, date.toLocaleDateString())
      .then(success => {
        console.log('success');
      })
      .catch(e => {
        console.log(e);
      });
  }

  getMaintenance() {
    const maintenanceSubscription = this._maintenanceService.getMaintenance().subscribe(data => {
      this.items = data;
      data.forEach((maintenance: any, i) => {
        this.items[i].title = maintenance.date;
        if (this.items.length === i + 1) {
          this.maintenanceKey = maintenance.key;
          this.month = this.items[i].title;
          console.log(this.maintenanceKey);
          this.getAllOwners();
        }
      });
      maintenanceSubscription.unsubscribe();
    });
  }
}
