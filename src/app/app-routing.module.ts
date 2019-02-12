import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticeBoardComponent } from './notice-board/notice-board.component';
import { MyParkingComponent } from './my-parking/my-parking.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

import { CreateOwnerComponent } from './create-owner/create-owner.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewOwnersComponent } from './view-owners/view-owners.component';
import { LoginComponent } from './login/login.component';
import { PayMaintenanceComponent } from './pay-maintenance/pay-maintenance.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { RequestsComponent } from './requests/requests.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { ResidentGuardService } from './services/resident-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Admin url
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  {
    path: 'view-owners',
    component: ViewOwnersComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  {
    path: 'create-owner',
    component: CreateOwnerComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  {
    path: 'requests',
    component: RequestsComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  {
    path: 'complaints',
    component: ComplaintsComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  {
    path: 'notice-board',
    component: NoticeBoardComponent,
    // canActivate: [AuthGuardService, AdminGuardService],
  },
  // Resident url
  {
    path: 'my-parking',
    component: MyParkingComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
  {
    path: 'search',
    component: SearchComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
  {
    path: 'booking',
    component: BookingComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
  {
    path: 'pay-maintenance',
    component: PayMaintenanceComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
  {
    path: 'requests',
    component: RequestsComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
  {
    path: 'complaints',
    component: ComplaintsComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
  {
    path: 'notice-board',
    component: NoticeBoardComponent,
    // canActivate: [AuthGuardService, ResidentGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
