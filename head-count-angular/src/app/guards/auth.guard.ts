import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../core/_services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {  // | Promise<boolean> | boolean
    const url: string = state.url;
    return this.checkLogin(url);  // this.checkLogin(url, next.data['role']);
  }

  checkLogin(url: string): Observable<boolean> {
    if (this.authService.isAuthenticated()) { return of(true); }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);

    return of(false);
  }

  // checkLogin(url: string, role: string): Observable<boolean> {
  //   const userType = {admin: 3, normal: 2, guest: 1};
  //   if (this.authService.hasPermission(userType[role] || 1)) { return of(true); }
  //
  //   // Store the attempted URL for redirecting
  //   this.authService.redirectUrl = url;
  //
  //   // Navigate to the login page with extras
  //   this.router.navigate(['/login']);
  //
  //   return of(false);
  // }


}
