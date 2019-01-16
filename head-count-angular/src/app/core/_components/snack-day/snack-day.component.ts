import {Component, OnDestroy, OnInit} from '@angular/core';
import {SnackDayMapping} from '../../_models/snack';
import {takeWhile} from 'rxjs/internal/operators';
import {SnackService} from '../../_services/snack.service';
import {AlertService} from '../../../shared/_components/alert/alert.service';

@Component({
  selector: 'app-snack-day',
  templateUrl: './snack-day.component.html',
  styleUrls: ['./snack-day.component.css']
})
export class SnackDayComponent implements OnInit, OnDestroy {

  alive = true;
  snackDayMapping: Array<SnackDayMapping>;
  currentDay: number;

  constructor(
    private snackService: SnackService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.snackDayMapping = [];
    // Get the weekday
    const today = new Date();
    this.currentDay = today.getDay();
    let day = this.currentDay;
    while (day !== 1) {
      day = day - 1;
      today.setDate(today.getDate() - 1);
    }

    // We got the monday now, So loop through and get the dates for the five days
    const my_list = [];
    let cnt = 0;
    while (cnt < 5) {
      console.log('Today is ' + today);
      const my_date = today;
      my_list.push(today.getTime());
      today.setDate(today.getDate() + 1);
      cnt = cnt + 1;
    }
    // Make a function call
    this.getSnacksForDates(my_list);
  }


  getSnacksForDates(date_list) {
    this.snackService.getSnackForDates(date_list).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        data = (data['data']);
        for (const each_row of data) {
          const tmp = new SnackDayMapping();
          tmp.date = each_row['date'];
          tmp.snack = each_row['snack'];
          this.snackDayMapping.push(tmp);
        }
        console.log(this.snackDayMapping);
      },
      error => {
        this.alertService.error(error);
      });

  }

  ngOnDestroy() {
    this.alive = false;
  }

}
