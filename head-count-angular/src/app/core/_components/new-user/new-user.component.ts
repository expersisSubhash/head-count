import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {takeWhile} from 'rxjs/operators';
import {UserService} from '../../_services/user.service';
import {AlertService} from '../../../shared/_components/alert/alert.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit, OnDestroy {
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
      id: null,
      first_name: ['', Validators.required],
      email: ['', Validators.email],
      last_name: ['', Validators.required],
      is_superuser: [false, Validators.required]
    });
  }


  ngOnInit() {}

  onEdit(obj) {
    this.userService.getuserDetails(obj.id).pipe(takeWhile(() => this.alive)).subscribe(response => {
      if (!response.error) {
        const user = response['user'];
        this.form.patchValue({
          id: user.id,
          first_name: user.first_name,
          email: user.email,
          last_name: user.last_name,
          is_superuser: user.is_superuser
        });
      } else {
        this.alertService.error(response.msg);
      }
    });
  }

  onSubmit() {
    if (this.form.get('id').value) {
      console.log('inside the edit');
      this.userService.editUser(this.form.getRawValue()).subscribe(response => {
        if (response.error) {
          this.alertService.error(response.msg);
        } else {
          this.bsModalRef.hide();
          this.submitEvent.emit();
          this.alertService.success(response.msg);
        }
      });
    } else {
      this.userService.newUser(this.form.getRawValue()).subscribe(response => {
        if (response.error) {
          this.alertService.error(response.msg);
        } else {
          this.bsModalRef.hide();
          this.submitEvent.emit();
          this.alertService.success(response.msg);
        }
      });
    }
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

