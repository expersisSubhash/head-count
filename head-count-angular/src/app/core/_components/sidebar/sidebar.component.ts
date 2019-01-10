import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuList: Array<any> = [
    {
      header: 'Dashboard',
      menus: [
        {name: 'Dashboard', url: '/dashboard'},
      ],
      role: 'normal'
    },
  ];

  isAlive = true;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
