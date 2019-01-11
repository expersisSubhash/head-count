import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/user';
import {takeWhile} from 'rxjs/internal/operators';
import {ConfirmAlertBoxService} from '../../_components/shared/confirm-alert-box/confirm-alert-box.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private alive = true;
  userList: Array<User>;
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
        this.userList = data['user_list'];
      },
      error => {
        console.log(error);
      });
  }

    deleteUser(obj) {
    // this.confirmBoxService.confirmBox({
    //   body: `Are you sure you wish to remove ${obj.username} ?`,
    //   callback: () => {
    //     this.pduService.deletePdu(obj.id).pipe(takeWhile(() => this.isAlive)).subscribe(data => {
    //       this.getPduList();
    //     });
    //   }
    // });
  }

    newUser(obj) {
    // this.confirmBoxService.confirmBox({
    //   body: `Are you sure you wish to remove ${obj.username} ?`,
    //   callback: () => {
    //     this.pduService.deletePdu(obj.id).pipe(takeWhile(() => this.isAlive)).subscribe(data => {
    //       this.getPduList();
    //     });
    //   }
    // });
  }

}
