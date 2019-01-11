import {Component, OnDestroy, OnInit} from '@angular/core';
import {Snack} from '../../_models/snack';
import {SnackService} from '../../_services/snack.service';
import {takeWhile} from 'rxjs/internal/operators';

@Component({
  selector: 'app-snacks-list',
  templateUrl: './snacks-list.component.html',
  styleUrls: ['./snacks-list.component.css']
})
export class SnacksListComponent implements OnInit, OnDestroy {

  private alive = true;
  snackList: Array<Snack>;

  constructor(
    private snackService: SnackService
  ) {
  }

  ngOnInit() {
      this.getAllSnacks();
  }

  getAllSnacks() {
    this.snackService.getAllSnacks().pipe(takeWhile(() => this.alive)).subscribe(data => {
      this.snackList = data['snack_list'];
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
