import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../core/_services/auth.service';
import {Observable} from 'rxjs';
import {AlertService} from '../shared/_components/alert/alert.service';

import {finalize, tap} from 'rxjs/operators';
import {LoaderService} from '../shared/_components/loader/loader.service';
import {Router} from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers;
    const customHeader = new HttpHeaders().append('Authorization', `Token ${this.auth.getToken()}`);
    if (headers.get('Content-Type') === 'multipart/form-data') {
      customHeader.append('Content-Type', 'multipart/form-data');
    } else {
      customHeader.append('Content-Type', 'application/json');
    }
    const authReq = req.clone({headers: customHeader});
    this.loaderService.start();
    // const started = Date.now();
    let ok: string;
    return next.handle(authReq).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => {
          if (event instanceof HttpResponse) {
            this.loaderService.stop();
          }
        },
        // Operation failed; error is an HttpErrorResponse
        error => {
          ok = 'failed';
          this.loaderService.stop();
          if (error.status === 401) {
            this.auth.redirectUrl = this.router.url;
            this.router.navigate(['/login']);
          } else {
            console.log(error);
            this.alertService.error(error.message);
          }
        },
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        // const elapsed = Date.now() - started;
        // const msg = `${req.method} "${req.urlWithParams}"
        //    ${ok} in ${elapsed} ms.`;
        // this.alertService.error(msg);
      })
    );
  }
}
