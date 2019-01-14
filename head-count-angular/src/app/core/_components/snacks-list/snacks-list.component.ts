import {Component, OnDestroy, OnInit} from '@angular/core';
import {Snack} from '../../_models/snack';
import {SnackService} from '../../_services/snack.service';
import {takeWhile} from 'rxjs/internal/operators';
import {NewUserComponent} from '../new-user/new-user.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NewSnackComponent} from '../new-snack/new-snack.component';
import {ConfirmAlertBoxService} from '../../_services/confirm-alert-box.service';

@Component({
  selector: 'app-snacks-list',
  templateUrl: './snacks-list.component.html',
  styleUrls: ['./snacks-list.component.css']
})
export class SnacksListComponent implements OnInit, OnDestroy {

  private alive = true;
  snackList: Array<Snack>;
  bsModalRef: BsModalRef;


  constructor(
    private snackService: SnackService,
    private bsModalService: BsModalService,
    private confirmBoxService: ConfirmAlertBoxService
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

  newSnack(obj?) {
    this.bsModalRef = this.bsModalService.show(NewSnackComponent, {ignoreBackdropClick: true});
    if (obj) {
      this.bsModalRef.content.onEdit(obj);
    }
    this.bsModalRef.content.submitEvent.pipe(takeWhile(() => this.alive)).subscribe(data => {
      this.getAllSnacks();
    });
  }

  deleteSnack(obj) {
    this.confirmBoxService.confirmBox({
      body: `Are you sure you wish to remove ${obj.name} ?`,
      callback: () => {
        this.snackService.removeSnacks(obj.id).pipe(takeWhile(() => this.alive)).subscribe(data => {
          this.getAllSnacks();
        });
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
