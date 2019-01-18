import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeWhile} from 'rxjs/internal/operators';
import {SnackService} from '../../_services/snack.service';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {Snack, TodaysSnack} from '../../_models/snack';

@Component({
  selector: 'app-user-snacks-detail',
  templateUrl: './user-snacks-detail.component.html',
  styleUrls: ['./user-snacks-detail.component.css']
})
export class UserSnacksDetailComponent implements OnInit, OnDestroy {

  alive = true;
  todays_snack: TodaysSnack;
  snack_info: Snack;
  ordered = false;
  user: any;
  userList: any;
  totalCount: 0;

  constructor(
    private snackService: SnackService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
    }
    if (this.user) {
      this.getSnackForToday();
    } else {
      this.alertService.error('Please login');
    }
    if ( this.user.is_super) {
      this.getInterestedUserCount();
    }
  }

  getInterestedUserCount() {
    this.snackService.getInterestedUsersCount().pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        console.log(data);
        this.userList = data['user_list'];
        this.totalCount = data['user_count'];
      },
      error => {
      });
  }

  getSnackForToday() {
    this.snackService.getSnackForToday(this.user.id).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        console.log(data);
        this.todays_snack =  data['snack'];
        this.snack_info =  data['snack_info'];
        this.ordered = data['choice'];
      },
      error => {
        console.log(error);
        this.alertService.error(error);
      });
  }


  toggle_order() {
    this.ordered = !this.ordered;
    const param = {};
    param['user_id'] = this.user.id;
    param['snack_day_id'] = this.todays_snack['id'];
    param['choice'] = this.ordered;

    this.snackService.saveUsersSnackChoice(param).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        this.alertService.success(data['msg']);
        this.getInterestedUserCount();
      },
      error => {
        this.alertService.error(error);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }


}
