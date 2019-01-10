import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from '../_models/user';

@Injectable()
export class AuthService {

  isLoggedIn = false;

  redirectUrl: string;

  GUEST_USER = 1;
  NORMAL_USER = 2;
  ADMIN_USER = 3;

  constructor(private http: HttpClient) { }

  getToken(): string {
    return localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : '';
  }

  hasPermission(permission: number) {
    const user = this.getUserInfo();
    let flag = false;
    let userType = this.GUEST_USER;
    if (user) {
      if (user['is_active'] && !user['is_superuser']) {
        userType = this.NORMAL_USER;
      } else if (user['is_superuser']) {
        userType = this.ADMIN_USER;
      } else {
        userType = this.GUEST_USER;
      }
    }
    if (permission === this.GUEST_USER) {
      flag = true;
    } else if (permission === this.NORMAL_USER && userType !== this.GUEST_USER) {
      flag = true;
    } else if (permission === this.ADMIN_USER && (userType !== this.GUEST_USER && userType !== this.NORMAL_USER)) {
      flag = true;
    }
    return flag;
  }

  isAuthenticated(): boolean {
    const token = JSON.parse(localStorage.getItem('token'));
    let flag;
    if (token) {
      this.isLoggedIn = true;
      flag = true;
      this.verifyToken(token).subscribe(
        data => {
          this.isLoggedIn = data.length > 0;
          if (!this.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        },
        () => {
          this.logout();
        }
      );
    } else {
      flag = false;
      this.isLoggedIn = false;
    }
    return flag;
  }

  login(loginObj: User): Observable<User> {
    return this.http.post<User>('/api/api-token-auth/', loginObj);
  }

  getUserInfo() {
    let user: User = new User();
    if (localStorage.getItem('user')) {
      user = JSON.parse(atob(localStorage.getItem('user')));
    }
    return user;
  }

  verifyToken(token): Observable<any> {
    return of(this.getToken());
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
  }

  changeUserPassword(formData): Observable<any> {
    return this.http.post('/api/change_password/', formData);
  }

}
