import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeWhile} from 'rxjs/operators';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {UserService} from '../../_services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  alive = true;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.email],
    });
  }


  ngOnInit() {
  }

  onSubmit() {
    const tmp = this.form.getRawValue();
    console.log(tmp);
    this.userService.forgotPassword(tmp).subscribe(response => {
      if (response.error) {
        this.alertService.error(response.msg);
      } else {
        this.bsModalRef.hide();
        this.submitEvent.emit();
        this.alertService.success(response.msg);
      }
    });
  }

  errorMessage(control: string, errorName: string) {
    return this.form.get(control).hasError(errorName) && (this.form.get(control).dirty || this.form.get(control).touched);
  }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
