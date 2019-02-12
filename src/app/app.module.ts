import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module'; // Rounting module import
import { AppComponent } from './app.component'; // Root component import

// Angularfire2 imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

// Components import
import { LoginComponent } from './login/login.component';
import { NoticeBoardComponent } from './notice-board/notice-board.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { MyParkingComponent } from './my-parking/my-parking.component';
import { PayMaintenanceComponent } from './pay-maintenance/pay-maintenance.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NebularModule } from './nebular/nebular.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgBootstrapModule } from './ng-bootstrap/ng-bootstrap.module';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';

import {
  NbUserModule,
  NbInputModule,
  NbButtonModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbContextMenuModule,
} from '@nebular/theme';
import { CreateOwnerComponent } from './create-owner/create-owner.component';
import { ViewOwnersComponent } from './view-owners/view-owners.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RequestsComponent } from './requests/requests.component';

// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NoticeBoardComponent,
    MaintenanceComponent,
    ComplaintsComponent,
    MyParkingComponent,
    PayMaintenanceComponent,
    SidebarComponent,
    SearchComponent,
    BookingComponent,
    CreateOwnerComponent,
    ViewOwnersComponent,
    DashboardComponent,
    RequestsComponent,
  ],
  imports: [
    NgBootstrapModule,
    BrowserModule,
    AppRoutingModule,
    // PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase, 'society-management'),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    NebularModule,
    NbUserModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbDatepickerModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
