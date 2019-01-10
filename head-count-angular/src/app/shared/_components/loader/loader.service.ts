import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class LoaderService {

  loading: Observable<boolean>;
  private loadingSubject = new Subject<boolean>();
  constructor() {
    this.loading = this.loadingSubject.asObservable();
  }

  public start(): void {
    this.loadingSubject.next(true);
  }


  public stop(): void {
    this.loadingSubject.next(false);
  }


}
