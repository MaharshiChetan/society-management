import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { RequestsService } from '../services/requests.service';
import { OwnerService } from '../services/owner.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {
  requestForm: FormGroup;
  mode: string;
  requestId: any;
  deletableRequestId: any;
  uid: string;
  myRequests: any;
  owner: {};
  allRequests: any[];
  isAdmin: boolean;

  constructor(
    private dialogService: NbDialogService,
    private _toastService: ToastService,
    private _authService: AuthService,
    private _requestService: RequestsService,
    private _ownerService: OwnerService,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.isAdmin = this._authService.isAdminOrRedisent;

    this.getRequests();
    this._authService.getAuthState().subscribe(state => {
      if (state) {
        this.uid = state.uid;
        this._ownerService.getOwnerByUID(this.uid).subscribe(owner => {
          this.owner = owner;
          this.refresh();
        });
      }
    });
  }

  refresh() {
    this.cd.detectChanges();
  }

  createForm(request?: any): any {
    if (request) {
      this.mode = 'edit';
      this.requestId = request.key;
      this.requestForm = new FormGroup({
        title: new FormControl(request.title || '', Validators.required),
        message: new FormControl(request.message || '', Validators.required),
        creationDate: new FormControl(request.creationDate || new Date().toLocaleString()),
      });
      return;
    }
    this.mode = 'create';
    this.requestId = '';
    this.requestForm = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      creationDate: new FormControl(new Date().toLocaleString()),
    });
  }

  createRequest(ref: any) {
    let request = this.requestForm.value;
    request.creationDate = new Date().toLocaleString();
    request.uid = this.uid;
    this._requestService
      .createRequest(request)
      .then(data => {
        if (data) {
          ref.close();
          this.showToast('success');
        }
        this.requestForm.reset();
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail');
      });
  }

  getRequests() {
    this._requestService.getAllRequests().subscribe(requests => {
      if (!this.isAdmin) {
        let tempRequests: any = requests.reverse();
        this.myRequests = tempRequests.filter((request: any) => {
          return this.uid == request.uid;
        });
        this.refresh();
      } else {
        this.allRequests = requests.reverse();
        requests.forEach((request: any, i) => {
          const subscription = this._ownerService
            .getOwnerByUID(request.uid)
            .subscribe((owner: any) => {
              this.allRequests[i].ownerDetail = owner;
              subscription.unsubscribe();
              this.refresh();
            });
        });
      }
    });
  }

  removeRequest(ref: any) {
    ref.close();
    this._requestService
      .removeRequest(this.deletableRequestId)
      .then(() => {
        this.showToast('success', 'request has been deleted successfully!');
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail', 'Error while deleting the request!');
      });
  }

  createRequestDialog(dialog: TemplateRef<any>, request: any) {
    if (request) {
      this.createForm(request);
      this.requestId = request.key;
      this.dialogService.open(dialog, { context: 'Edit request title and message' });
      return;
    }
    this.createForm();
    this.dialogService.open(dialog, { context: 'Add request title and message' });
  }

  updateRequest(ref: any) {
    let request = this.requestForm.value;
    request.creationDate = new Date().toLocaleString();
    this._requestService
      .updateRequest(request, this.requestId)
      .then(data => {
        ref.close();
        console.log('edited');
        this.showToast('success', 'request is updated successfully!');
        this.requestForm.reset();
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail', 'something went wrong while updating the request!');
      });
  }

  editRequestDialog(dialog: TemplateRef<any>, request: any) {
    if (request) {
      this.createForm(request);
      this.requestId = request.key;
      this.dialogService.open(dialog, { context: 'Edit request title and message' });
      return;
    }
    this.createForm();
    this.dialogService.open(dialog, { context: 'Add request title and message' });
  }

  showToast(type: string, message?: string) {
    if (type === 'fail') {
      this._toastService.showToast(
        'top-right',
        'danger',
        'Failed',
        message || 'Failed to create the request!.'
      );
    } else {
      this._toastService.showToast(
        'top-right',
        'success',
        'Success',
        message || 'request is created Successfully!.'
      );
    }
  }

  showDialog(request: any, dialog: TemplateRef<any>) {
    this.deletableRequestId = request.key;
    this.dialogService.open(dialog, { context: 'Are you sure for deleting the request?' });
  }
}
