import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {takeWhile} from 'rxjs/operators';
import {SidebarService} from '../../_services/sidebar.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.projectTitle = 'Xebrium';
    setInterval(() => {
      this.now = new Date();
    }, 1);
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

  toggleSidebar() {
    this.sidebarService.toggle();
  }

}
