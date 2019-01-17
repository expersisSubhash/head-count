import {Component, OnDestroy, OnInit} from '@angular/core';
import {SnackDayMapping} from '../../_models/snack';
import {takeWhile} from 'rxjs/internal/operators';
import {SnackService} from '../../_services/snack.service';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-snack-day',
  templateUrl: './snack-day.component.html',
  styleUrls: ['./snack-day.component.css'],
  providers: [DatePipe]
})
export class SnackDayComponent implements OnInit, OnDestroy {

  alive = true;
  snackDayMapping: Array<SnackDayMapping>;
  snacksList: Array<any>;
  currentDay: number;
  form: FormGroup;

  constructor(
    private snackService: SnackService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.form = fb.group({
      snack_data: this.fb.array([])
    });
  }

  ngOnInit() {
    // Get all snacks
    this.getAllSnacks();
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
      const my_date = today;
      my_list.push(today.getTime());
      today.setDate(today.getDate() + 1);
      cnt = cnt + 1;
    }
    // Make a function call
    this.getSnacksForDates(my_list);
  }

  newSnack(data?) {
    const f = this.fb.group({
      snack: '',
      price: 0.0,
      display_date: '',
      date: new Date(),
      snack_day_mapping_id: 0,
    });
    if (data) {
      f.patchValue(data);
      const my_date = new Date(data['date']);
      if (my_date.getDate() < (new Date().getDate())) {
        f.disable();
      }
    }

    return f;
  }

  get snacks() {
    return this.form.get('snack_data') as FormArray;
  }

  getAllSnacks() {
    this.snackService.getAllSnacks().pipe(takeWhile(() => this.alive)).subscribe(response => {
      if (response['snack_list']) {
        this.snacksList = response['snack_list'];
      }
    });
  }

  setPrice(event, obj: any) {
    const _snack = this.snacksList.find((snack) => snack.id.toString() === event.toString());
    obj.patchValue({price: _snack ? _snack.default_price : 0.0});
  }

  getSnacksForDates(date_list) {
    this.snackService.getSnackForDates(date_list).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        data = (data['data']);
        console.log(data);
        for (const each_row of data) {
          const tmp = new SnackDayMapping();
          tmp.date = each_row['date'];
          console.log(each_row);
          // Get snack here
          const snack = each_row['snack'];
          tmp.snack_name = snack['snack_name'];
          tmp.price_for_day = snack['price_for_day'];
          const snack_id = snack['snack_id'] ? snack['snack_id'] : 0;
          this.snacks.push(this.newSnack({
            snack: snack_id,
            date: tmp.date,
            display_date: this.datePipe.transform(tmp.date, 'EEE dd, MMM yyyy'),
            price: tmp.price_for_day ? tmp.price_for_day : 0.0,
            snack_day_mapping_id: snack['id'] ? snack['id'] : 0
          }));
        }
      },
      error => {
        this.alertService.error(error);
      });
  }

  onSubmit() {
    console.log(this.snacks.getRawValue());
    this.snackService.createSnackDayMapping(this.snacks.getRawValue()).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
        this.alertService.success(data['msg']);
      },
      error => {
        this.alertService.error(error);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
