import {Component, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {SidebarService} from '../../_services/sidebar.service';
import {takeWhile} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isShow = true;
  bsModalRef: BsModalRef;
  user: any;
  menuList: Array<any> = [
    {
      header: 'Dashboard',
      menus: [
        {name: 'TODAY\'S SNACK', url: '/snack-detail', image: '../../../../../assets/images/dish.png', action: 0, is_super_user: 0},
        {name: 'SNACK CALENDER', url: '/snack-day', image: '../../../../../assets/images/calender.png', action: 0, is_super_user: 1},
        {name: 'SNACKS', url: '/snacks', image: '../../../../../assets/images/menu.png', action: 0, is_super_user: 1},
        {name: 'USERS', url: '/users', image: '../../../../../assets/images/users.png', action: 0, is_super_user: 1},
        {name: 'REPORTS', url: '/users', image: '../../../../../assets/images/analysis.png', action: 0, is_super_user: 1},
        {name: 'CHANGE PASSWORD', url: '', image: '../../../../../assets/images/padlock.png', action: 2, is_super_user: 0},
        {name: 'LOGOUT', url: '', image: '../../../../../assets/images/logout.png', action: 1, is_super_user: 0},
      ],
      role: 'normal'
    },
  ];

  isAlive = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private sidebarService: SidebarService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private bsModalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.user = this.auth.getUserInfo();
    this.sidebarService.$data.subscribe(data => {
      this.isShow = data;
      if (this.isShow) {
        this.renderer.addClass(this.document.body, 'back');
      } else {
        this.renderer.removeClass(this.document.body, 'back');
      }
    });
  }

  openRouterLink(url: string) {
    this.router.navigate([url]);
    this.close();
  }

  close() {
    this.sidebarService.close();
  }

  routerLinkActive(url) {
    return this.router.isActive(url, false);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  changePassword() {
    this.bsModalRef = this.bsModalService.show(ChangePasswordComponent, {ignoreBackdropClick: true});
  }

  hasPermission() {
    let flag = false;
    if (this.user.is_super) {
      flag = true;
    }
    return flag;
  }
}
