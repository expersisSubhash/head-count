import {Component, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {SidebarService} from '../../_services/sidebar.service';
import {takeWhile} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isShow = true;
  menuList: Array<any> = [
    {
      header: 'Dashboard',
      menus: [
        {name: 'SNACKS', url: '/snacks', image: '../../../../../assets/images/menu.png'},
        {name: 'USERS', url: '/users', image: '../../../../../assets/images/users.png'},
        {name: 'TODAY\'S SNACK', url: '/snack-day', image: '../../../../../assets/images/dish.png'}
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
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
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

}
