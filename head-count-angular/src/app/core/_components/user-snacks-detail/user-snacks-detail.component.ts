import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeWhile} from 'rxjs/internal/operators';
import {SnackService} from '../../_services/snack.service';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {Snack, TodaysSnack} from '../../_models/snack';
import {ReportsService} from '../../_services/reports.service';
import {error} from 'util';

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
  disable_choice_button = false;
  display_time = ' ';
  cut_out_time: number;
  snack_name: string;

  constructor(
    private snackService: SnackService,
    private alertService: AlertService,
    private reportService: ReportsService
  ) {
  }

  ngOnInit() {
    this.snack_name = '-';
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
    }
    if (this.user) {
      this.getSnackForToday();
    } else {
      this.alertService.error('Please login');
    }
    if (this.user.is_super) {
      this.getInterestedUserCount();
    }

    this.getCutoutTime();
    setInterval(() => {
      const time = new Date().getHours();
      if (time >= this.cut_out_time) {
        this.disable_choice_button = true;
      }
    }, 1000);
  }

  getInterestedUserCount() {
    this.snackService.getInterestedUsersCount().pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        console.log(data);
        this.userList = data['user_list'];
        this.totalCount = data['user_count'];
      },
      err => {
        this.alertService.error(err);
      });
  }

  getCutoutTime() {
    this.reportService.getAllPreferences().pipe(takeWhile(() => this.alive)).subscribe(data => {
        if (data['preferences']) {
          const tmp = data['preferences'][0];
          this.cut_out_time = tmp['value'];
          const val_converted = this.cut_out_time % 12;
          this.display_time = val_converted.toString() + ' PM';

          const time = new Date().getHours();
          if (time >= this.cut_out_time) {
            this.disable_choice_button = true;
          }
        }
      },
      er => {
        this.alertService.error(er);
      });
  }

  getSnackForToday() {
    this.snackService.getSnackForToday(this.user.id).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        console.log(data);
        if (data['snack']) {
          this.todays_snack = data['snack'];
          this.snack_info = data['snack_info'];
          if (this.snack_info && this.snack_info.name) {
            this.snack_name = this.snack_info.name;
          }
          this.ordered = data['choice'];
        }
      },
      err => {
        console.log(error);
        this.alertService.error(err);
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
      err => {
        this.alertService.error(err);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }


}
