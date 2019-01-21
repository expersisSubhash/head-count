import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportsService} from '../../_services/reports.service';
import {takeWhile} from 'rxjs/internal/operators';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {Router} from '@angular/router';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  settings = [];
  alive = true;
  selectedTab = 1;
  fromDate: Date;
  toDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();
  dataList: Array<any>;
  grand_total = -1;

  constructor(
    private reportService: ReportsService,
    private alertService: AlertService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getAllPreferences();
    this.bsConfig = Object.assign({}, {containerClass: 'theme-orange'});
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

  generate_report() {
    if (this.fromDate && this.toDate) {
      if (this.toDate < this.fromDate) {
        this.alertService.error('To date can not be earlier than from date');
      } else {
        if (this.selectedTab === 2) {
          const params = {
            'from_date': this.fromDate.getTime(),
            'to_date': this.toDate.getTime()
          };
          this.reportService.getSnackReport(params).pipe(takeWhile(() => this.alive)).subscribe(
            data => {
              this.dataList = data['data'];
              this.grand_total = data['grand_total'];
            },
            error1 => {
              this.alertService.error(error1);
            }
          );
        }
      }

    } else {
      this.alertService.error('Please select From and To Dates');
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}

