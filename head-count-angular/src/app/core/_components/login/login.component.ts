import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/_components/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFG: FormGroup;
  loginError = false;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginFG = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.logout();
  }

  errorMessage(control: string, errorName: string) {
    return this.loginFG.get(control).hasError(errorName) && (this.loginFG.get(control).dirty || this.loginFG.get(control).touched);
  }

  onSubmit(): void {
    this.authService.login(this.loginFG.value).subscribe(data => {
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
}
