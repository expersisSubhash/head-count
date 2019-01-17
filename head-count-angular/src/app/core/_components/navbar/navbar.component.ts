import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {takeWhile} from 'rxjs/operators';
import {SidebarService} from '../../_services/sidebar.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NewUserComponent} from '../new-user/new-user.component';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {SnackService} from '../../_services/snack.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any;
  projectTitle: string;
  isAlive = true;
  now: Date;
  bsModalRef: BsModalRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService,
    private bsModalService: BsModalService,
    private snackService: SnackService
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.projectTitle = 'Xebrium';
    setInterval(() => {
      this.now = new Date();
    }, 600);
  }

  openRouterLink(url: string) {
    this.router.navigate([url]);
    this.sidebarService.close();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  Change_password() {
    this.bsModalRef = this.bsModalService.show(ChangePasswordComponent, {ignoreBackdropClick: true});
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

}
