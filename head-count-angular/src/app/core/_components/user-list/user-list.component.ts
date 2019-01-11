import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {takeWhile} from 'rxjs/internal/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private alive = true;
  userList = [];

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getuserList();
  }

  getuserList() {
    this.userService.getAllUsers().pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        this.userList = data;
      },
      error => {
        console.log(error);
      });
  }
}
