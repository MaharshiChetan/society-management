import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OwnerService } from '../services/owner.service';
import { ComplaintsService } from '../services/complaints.service';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalRequests: number;
  totalOwners: number;
  totalComplaints: any;

  constructor(
    private _ownerService: OwnerService,
    private _complaintsService: ComplaintsService,
    private _requestsService: RequestsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getRequests();
    this.getOwners();
    this.getComplaints();
  }

  refresh() {
    this.cd.detectChanges();
  }

  getRequests(): any {
    this._requestsService.getAllRequests().subscribe(requests => {
      this.totalRequests = requests.length;
    });
  }

  getOwners(): any {
    this._ownerService.getAllOwners().subscribe(owners => {
      this.totalOwners = owners.length;
    });
  }

  getComplaints(): any {
    this._complaintsService.getAllComplaints().subscribe(complaints => {
      this.totalComplaints = complaints.length;
      this.refresh();
    });
  }
}
