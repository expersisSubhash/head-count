import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportsService} from '../../_services/reports.service';
import {takeWhile} from 'rxjs/internal/operators';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy{
  settings = [];
  alive = true;
  selectedTab = 1;

  constructor(
    private reportService: ReportsService,
    private alertService: AlertService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getAllPreferences();
  }

  getAllPreferences() {
    this.reportService.getAllPreferences().pipe(takeWhile(() => this.alive)).subscribe(data => {
        console.log(data);
        this.settings = data['preferences'];
      },
      error => {
        this.alertService.error(error);
      });
  }

  refreshPage(tab?: number) {
    if (tab) {
      this.selectedTab = tab;
    }
  }

  saveChanges() {
    this.reportService.savePreferences(this.settings[0]).pipe(takeWhile(() => this.alive)).subscribe(
      data => {
            this.alertService.success(data['msg']);
            this.getAllPreferences();
      },
      error1 => {
            this.alertService.error(error1);
      }
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }

}

