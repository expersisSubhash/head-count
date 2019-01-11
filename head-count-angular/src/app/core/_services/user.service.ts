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

  ) { }

  getAllUsers(): Observable<any> {
    return this.http.get<User>('/api/users/');
  }

}
