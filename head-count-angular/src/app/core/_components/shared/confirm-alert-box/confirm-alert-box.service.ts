import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ConfirmAlertBoxComponent} from './confirm-alert-box.component';
import {takeWhile} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Injectable()
export class ConfirmAlertBoxService {
  bsModalRef: BsModalRef;
  isAlive = true;
  constructor(private bsModalService: BsModalService) {}

  confirmBox(obj: {body: string, title?: string, actionButtonName?: string, callback: () => void, cancelCallback?: () => void}) {
    this.bsModalRef = this.bsModalService.show(ConfirmAlertBoxComponent, {ignoreBackdropClick: true});
    this.bsModalRef.content.body = obj.body;
    if (obj.title) {
      this.bsModalRef.content.title = obj.title;
    }
    if (obj.actionButtonName) {
      this.bsModalRef.content.actionButtonName = obj.actionButtonName;
    }
    this.bsModalRef.content.actionButtonEvent
      .pipe(takeWhile(() => this.bsModalRef.content.isAlive)).subscribe(data => {
      this.bsModalRef.hide();
      obj.callback();
    });
    this.bsModalRef.content.cancelButtonEvent.pipe(takeWhile(() => this.bsModalRef.content.isAlive))
      .subscribe(data => {
      this.bsModalRef.hide();
      obj.cancelCallback();
    });
  }

  onHide(): Observable<any> {
    return this.bsModalService.onHide;
  }
}
