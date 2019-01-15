import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-snack-day',
  templateUrl: './snack-day.component.html',
  styleUrls: ['./snack-day.component.css']
})
export class SnackDayComponent implements OnInit, OnDestroy {

  alive = true;
  constructor() {
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.alive = false;
  }

}
