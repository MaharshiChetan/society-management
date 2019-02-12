import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NbSidebarService, NbThemeService } from '@nebular/theme';
import { ApplicationStateService } from './services/application-state.service';
import { AuthService } from './services/auth.service';
import { OwnerService } from './services/owner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  toogleMenu: boolean = false;
  admin: boolean;
  authState: boolean = false;
  sideMenuItemsForResident = [
    { title: 'MY PARKING', icon: 'fas fa-map-marker-alt', link: '/my-parking' },
    { title: 'SEARCH', icon: 'fas fa-search', link: '/search' },
    { title: 'MY BOOKING', icon: 'fa fa-star', link: '/booking' },
    { title: 'PAY MAINTENANCE', icon: 'fas fa-money-bill-wave', link: '/pay-maintenance' },
    { title: 'REQUEST', icon: 'far fa-bell', link: '/requests' },
    { title: 'COMPLAINTS', icon: 'fa fa-flag-checkered', link: '/complaints' },
    { title: 'NOTICE BOARD', icon: 'far fa-comment', link: '/notice-board' },
  ];

  sideMenuItemsForAdmin = [
    { title: 'DASHBOARD', icon: 'fas fa-university', link: '/dashboard' },
    { title: 'VIEW OWNERS', icon: 'fas fa-users', link: '/view-owners' },
    { title: 'CREATE OWNERS', icon: 'fas fa-user-plus', link: '/create-owner' },
    { title: 'MAINTENANCE', icon: 'fas fa-money-bill-wave', link: '/maintenance' },
    { title: 'VIEW REQUESTS', icon: 'far fa-bell', link: '/requests' },
    { title: 'COMPLAINTS', icon: 'fa fa-flag-checkered', link: '/complaints' },
    { title: 'NOTICE BOARD', icon: 'far fa-comment', link: '/notice-board' },
  ];
  commonMenuItem = [{ title: 'LOGOUT', icon: 'fas fa-sign-out-alt' }];

  constructor(
    private applicationStateService: ApplicationStateService,
    private sidebarService: NbSidebarService,
    private themeService: NbThemeService,
    private authService: AuthService,
    private ownerService: OwnerService,
    private cd: ChangeDetectorRef,
    private _router: Router
  ) {
    if (this.applicationStateService.getIsMobileResolution()) {
      this.toggle();
    }
  }

  ngOnInit() {
    this.checkAuthState();
  }

  toggle() {
    this.toogleMenu = !this.toogleMenu;
    this.sidebarService.toggle(true);
    return false;
  }

  changeTheme() {
    this.themeService.changeTheme('default');
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this._router.navigate(['/']);
        console.log('logout success:');
      })
      .catch(() => {
        console.log('logout not success: ');
      });
  }

  refresh() {
    this.cd.detectChanges();
  }

  checkAuthState() {
    this.authService.getAuthState().subscribe(state => {
      console.log('data');

      if (state) {
        const subscription = this.ownerService.getOwnerByUID(state.uid).subscribe((owner: any) => {
          if (owner.admin) {
            this.admin = true;
            // this._router.navigate(['/dashboard']);
          } else {
            this.admin = false;
            // this._router.navigate(['/my-parking']);
          }
          this.refresh();
        });
      } else {
        this.admin = undefined;
      }
    });
  }
}
