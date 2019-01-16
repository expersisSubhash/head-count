import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isShow = true;
  subject = new Subject<boolean>();

  $data = this.subject.asObservable();

  constructor() { }

  toggle() {
    this.isShow = true;
    // this.isShow = !this.isShow;
    this.subject.next(this.isShow);
  }

  close() {
    this.isShow = true;
    this.subject.next(this.isShow);
  }
}
