import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {

  constructor(private http: HttpClient) { }

  getReleases(): Observable<any> {
    return this.http.get<any>('/api/releases/');
  }

  getReleaseDetail(id: number): Observable<any> {
    return this.http.get<any>(`/api/release_detail/${id}`);
  }
}
