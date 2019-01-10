import { Injectable } from '@angular/core';
import {Subject, Observable, interval } from 'rxjs';
import {Alert, AlertType} from './alert';
import {NavigationStart, Router} from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Injectable()
export class AlertService {
  private subject = new Subject<Alert>();
  private keepAfterRouteChange = false;
  private stopCondition = false;

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            if (this.keepAfterRouteChange) {
                // only keep for a single route change
                this.keepAfterRouteChange = false;
            } else {
                // clear alert messages
                this.clear();
            }
        }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false, timeout = 10000) {
    this.stopCondition = false;
    this.clear();
    this.alert(AlertType.Success, message, keepAfterRouteChange);
    interval(timeout).pipe(takeWhile(() => !this.stopCondition))
    .subscribe(i => {
        // This will be called every 10 seconds until `stopCondition` flag is set to true
      this.clear();
      this.stopCondition = true;
    });
  }

  error(message: string, keepAfterRouteChange = false) {
    this.clear();
    this.alert(AlertType.Error, message, keepAfterRouteChange);
  }

  info(message: string, keepAfterRouteChange = false) {
    this.clear();
    this.alert(AlertType.Info, message, keepAfterRouteChange);
  }

  warn(message: string, keepAfterRouteChange = false) {
    this.clear();
    this.alert(AlertType.Warning, message, keepAfterRouteChange);
  }

  alert(type: AlertType, message: string, keepAfterRouteChange = false) {
      this.keepAfterRouteChange = keepAfterRouteChange;
      this.subject.next(<Alert>{ type: type, message: message});
  }

  clear() {
    // clear alerts
    this.subject.next();
  }

}
