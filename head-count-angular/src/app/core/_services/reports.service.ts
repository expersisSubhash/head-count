import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Snack} from '../_models/snack';


@Injectable({
  providedIn: 'root'
})

export class ReportsService {
  constructor(
    private http: HttpClient
  ) {
  }

  getAllPreferences(): Observable<any> {
    return this.http.get<any>('/api/preferences/');
  }

  savePreferences(params): Observable<any> {
    return this.http.post<any>(`/api/preferences/`, params);
  }

  getSnackReport(params): Observable<any> {
    return this.http.post<any>(`/api/getSnackReport/`, params);
  }

}
