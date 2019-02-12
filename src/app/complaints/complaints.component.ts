import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { NbDialogService } from '@nebular/theme';
import { ComplaintsService } from '../services/complaints.service';
import { OwnerService } from '../services/owner.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent implements OnInit {
  complaintForm: FormGroup;
  mode: string;
  complaintId: any;
  deletableComplaintId: any;
  uid: string;
  myComplaints: any;
  owner: {};
  allComplaints: any[];
  isAdmin: boolean;

  constructor(
    private dialogService: NbDialogService,
    private _toastService: ToastService,
    private _authService: AuthService,
    private _complaintService: ComplaintsService,
    private _ownerService: OwnerService,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.isAdmin = this._authService.isAdminOrRedisent;

    this.getComplaints();
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

  createForm(complaint?: any): any {
    if (complaint) {
      this.mode = 'edit';
      this.complaintId = complaint.key;
      this.complaintForm = new FormGroup({
        title: new FormControl(complaint.title || '', Validators.required),
        message: new FormControl(complaint.message || '', Validators.required),
        creationDate: new FormControl(complaint.creationDate || new Date().toLocaleString()),
      });
      return;
    }
    this.mode = 'create';
    this.complaintId = '';
    this.complaintForm = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      creationDate: new FormControl(new Date().toLocaleString()),
    });
  }

  createComplaint(ref: any) {
    let complaint = this.complaintForm.value;
    complaint.creationDate = new Date().toLocaleString();
    complaint.uid = this.uid;
    this._complaintService
      .createComplaint(complaint)
      .then(data => {
        if (data) {
          ref.close();
          this.showToast('success');
        }
        this.complaintForm.reset();
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail');
      });
  }

  getComplaints() {
    this._complaintService.getAllComplaints().subscribe(complaints => {
      if (!this.isAdmin) {
        let tempComplaints: any = complaints.reverse();
        this.myComplaints = tempComplaints.filter((complaint: any) => {
          return this.uid == complaint.uid;
        });
        this.refresh();
      } else {
        this.allComplaints = complaints.reverse();
        complaints.forEach((complaint: any, i) => {
          const subscription = this._ownerService
            .getOwnerByUID(complaint.uid)
            .subscribe((owner: any) => {
              this.allComplaints[i].ownerDetail = owner;
              subscription.unsubscribe();
              this.refresh();
            });
        });
      }
    });
  }

  removeComplaint(ref: any) {
    ref.close();
    this._complaintService
      .removeComplaint(this.deletableComplaintId)
      .then(() => {
        this.showToast('success', 'Complaint has been deleted successfully!');
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail', 'Error while deleting the complaint!');
      });
  }

  createComplaintDialog(dialog: TemplateRef<any>, complaint: any) {
    if (complaint) {
      this.createForm(complaint);
      this.complaintId = complaint.key;
      this.dialogService.open(dialog, { context: 'Edit complaint title and message' });
      return;
    }
    this.createForm();
    this.dialogService.open(dialog, { context: 'Add complaint title and message' });
  }

  updateComplaint(ref: any) {
    let complaint = this.complaintForm.value;
    complaint.creationDate = new Date().toLocaleString();
    this._complaintService
      .updateComplaint(complaint, this.complaintId)
      .then(data => {
        ref.close();
        console.log('edited');
        this.showToast('success', 'Complaint is updated successfully!');
        this.complaintForm.reset();
      })
      .catch(e => {
        console.log(e);
        this.showToast('fail', 'something went wrong while updating the complaint!');
      });
  }

  editComplaintDialog(dialog: TemplateRef<any>, complaint: any) {
    if (complaint) {
      this.createForm(complaint);
      this.complaintId = complaint.key;
      this.dialogService.open(dialog, { context: 'Edit complaint title and message' });
      return;
    }
    this.createForm();
    this.dialogService.open(dialog, { context: 'Add complaint title and message' });
  }

  showToast(type: string, message?: string) {
    if (type === 'fail') {
      this._toastService.showToast(
        'top-right',
        'danger',
        'Failed',
        message || 'Failed to create the complaint!.'
      );
    } else {
      this._toastService.showToast(
        'top-right',
        'success',
        'Success',
        message || 'Complaint is created Successfully!.'
      );
    }
  }

  showDialog(complaint: any, dialog: TemplateRef<any>) {
    this.deletableComplaintId = complaint.key;
    this.dialogService.open(dialog, { context: 'Are you sure for deleting the complaint?' });
  }
}
