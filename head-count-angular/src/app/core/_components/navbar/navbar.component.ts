import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any;
  projectTitle: string;
  isAlive = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.projectTitle = 'Xebrium';
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
