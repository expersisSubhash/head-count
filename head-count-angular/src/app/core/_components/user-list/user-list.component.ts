import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/user';
import {takeWhile} from 'rxjs/internal/operators';
import {NewUserComponent} from '../new-user/new-user.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ConfirmAlertBoxService} from '../../_services/confirm-alert-box.service';
import {AlertService} from '../../../shared/_components/alert/alert.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private alive = true;
  userList: Array<User>;
  bsModalRef: BsModalRef;

  constructor(
    private userService: UserService,
    private bsModalService: BsModalService,
    private confirmBoxService: ConfirmAlertBoxService,
    private alertService: AlertService
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
    this.confirmBoxService.confirmBox({
      body: `Are you sure you wish to remove ${obj.username} ?`,
      callback: () => {
        this.userService.removeUser(obj.id).pipe(takeWhile(() => this.alive)).subscribe(data => {
          this.getuserList();
        });
      }
    });
  }

  newUser(obj?) {
    this.bsModalRef = this.bsModalService.show(NewUserComponent, {ignoreBackdropClick: true});
    if (obj) {
      this.bsModalRef.content.onEdit(obj);
    }
    this.bsModalRef.content.submitEvent.pipe(takeWhile(() => this.alive)).subscribe(data => {
      this.getuserList();
    });
  }

  toggleEmailSubscription(obj) {
      this.userService.toggleEmailSubscription(obj.id).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
         if (data['success']) {
           this.alertService.success('Changes saved successfully');
           this.getuserList();
         }
      },
      error => {
        this.alertService.error(error);
      });
}

}



