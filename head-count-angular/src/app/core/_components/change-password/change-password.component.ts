import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {SnackService} from '../../_services/snack.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeWhile} from 'rxjs/operators';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  alive = true;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      existing_password: ['', Validators.required],
      new_password: ['', Validators.required],
      retype_password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }


  onSubmit() {

    // Get the values from form
    const temp = this.form.getRawValue();
    const new_password = temp.new_password;
    const retyped_password = temp.retype_password;

    if (new_password !== retyped_password) {
      this.alertService.error('New password and retyped password does not match');
    } else {
      console.log('password match');
      if (localStorage.getItem('user')) {
        const user = JSON.parse(atob(localStorage.getItem('user')));
        temp['email'] = user.email;
        this.authService.changeUserPassword(temp).subscribe(response => {
          if (response.error) {
            this.alertService.error(response.msg);
          } else {
            this.bsModalRef.hide();
            this.submitEvent.emit();
            this.alertService.success(response.msg);
            // Add logout here
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        });
      }
    }
  }

  // errorMessage(control: string, errorName: string) {
  //   return this.form.get(control).hasError(errorName) && (this.form.get(control).dirty || this.form.get(control).touched);
  // }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
