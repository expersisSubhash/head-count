import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isShow = false;
  subject = new Subject<boolean>();

  $data = this.subject.asObservable();

  constructor() { }

  toggle() {
    this.isShow = !this.isShow;
    this.subject.next(this.isShow);
  }

  close() {
    this.isShow = false;
    this.subject.next(this.isShow);
  }
}
