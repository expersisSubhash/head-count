import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {NewUserComponent} from '../new-user/new-user.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {filter, takeWhile} from 'rxjs/internal/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  alive = true;
  loginFG: FormGroup;
  loginError = false;
  bsModalRef: BsModalRef;
  history = [];

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private bsModalService: BsModalService,
    private route: ActivatedRoute
  ) {
    this.loginFG = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate([this.authService.redirectUrl || `/snack-detail`]);
    } else {
      this.route.queryParamMap.pipe(takeWhile(() => this.alive)).subscribe(response => {
          const uid = response['params']['uid'];
          if (uid) {
            this.login({uid: uid});
          }
      });
    }
  }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  errorMessage(control: string, errorName: string) {
    return this.loginFG.get(control).hasError(errorName) && (this.loginFG.get(control).dirty || this.loginFG.get(control).touched);
  }

  onSubmit(): void {
    this.login(this.loginFG.value);
  }

  login(formData) {
    this.authService.login(formData).subscribe(data => {
        if (data['token']) {
          localStorage.setItem('token', JSON.stringify(data['token']));
          localStorage.setItem('user', btoa(JSON.stringify(data['user'])));
          this.authService.isLoggedIn = true;
          this.loginError = false;
        }
        this.router.navigate([this.authService.redirectUrl || `/snack-detail`]);
      },
      error => {
        this.alertService.clear();
        this.loginError = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  show_forgot_password() {
    this.bsModalRef = this.bsModalService.show(ForgotPasswordComponent, {ignoreBackdropClick: true});

  }
}
