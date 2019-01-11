import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-alert-box',
  templateUrl: './confirm-alert-box.component.html',
  styleUrls: ['./confirm-alert-box.component.css']
})
export class ConfirmAlertBoxComponent implements OnInit, OnDestroy {
  isAlive = true;
  title = 'Confirm';
  body = '';
  actionButtonName = 'Delete';
  @Output() actionButtonEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelButtonEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public bsModelRef: BsModalRef, private bsModalService: BsModalService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  onActionButton(event?: Event) {
    this.actionButtonEvent.emit(true);
  }

  onCancelButton(event?: Event) {
    this.cancelButtonEvent.emit(true);
  }

}
