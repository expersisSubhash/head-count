import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Snack} from '../_models/snack';


@Injectable({
  providedIn: 'root'
})

export class SnackService {
  constructor(
    private http: HttpClient
  ) {
  }

  getAllSnacks(): Observable<any> {
    return this.http.get<Snack>('/api/snacks/');
  }

  newSnack(formData): Observable<any> {
    return this.http.post<any>('/api/snacks/', formData);
  }

  editSnack(formData): Observable<any> {
    return this.http.post(`/api/editSnacks/`, formData);
  }

  removeSnacks(id): Observable<any> {
    return this.http.delete(`/api/removeSnacks/${id}/`);
  }

  getSnack(id): Observable<any> {
    return this.http.get<any>(`/api/getSnack/${id}/`);
  }

  getSnackForToday(user_id): Observable<any> {
    return this.http.get<any>(`/api/getSnackForToday/${user_id}`);
  }

  getSnackForDates(date_list): Observable<any> {
    return this.http.post<any>(`/api/getSnackForDates/`, date_list);
  }
  saveUsersSnackChoice(params): Observable<any> {
    return this.http.post<any>(`/api/saveUserSnackChoice/`, params);

  }
  createSnackDayMapping(obj_list): Observable<any> {
        return this.http.post<any>(`/api/createSnackDayMapping/`, obj_list);

  }
}
