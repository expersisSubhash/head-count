import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(
    private http: HttpClient
  ) {
  }

  getAllUsers(): Observable<any> {
    return this.http.get<User>('/api/users/');
  }

  newUser(formData): Observable<any> {
    return this.http.post<any>('/api/users/', formData);
  }

  editUser(formData): Observable<any> {
    return this.http.put(`/api/editUser/${formData.id}/`, formData);
  }

  removeUser(id): Observable<any> {
    return this.http.delete(`/api/removeUser/${id}/`);
  }


}
