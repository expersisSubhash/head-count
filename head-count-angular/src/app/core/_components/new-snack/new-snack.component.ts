import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {takeWhile} from 'rxjs/operators';
import {SnackService} from '../../_services/snack.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../../shared/_components/alert/alert.service';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-new-snack',
  templateUrl: './new-snack.component.html',
  styleUrls: ['./new-snack.component.css']
})
export class NewSnackComponent implements OnInit, OnDestroy {
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  alive = true;
  image_file: null;

  constructor(
    private snackService: SnackService,
    private alertService: AlertService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      id: null,
      name: ['', Validators.required],
      default_price: [0.0, Validators.required],
      image_name: null
    });
  }

  ngOnInit() {
  }

  onEdit(obj) {
    this.snackService.getSnack(obj.id).pipe(takeWhile(() => this.alive)).subscribe(response => {
      if (!response.error) {
        const snack = response['snack'];
        this.form.patchValue({
          id: snack.id,
          name: snack.name,
          default_price: snack.default_price,
          image_name: snack.image_name,
        });
      } else {
        this.alertService.error(response.msg);
      }
    });
  }

  onSubmit() {
    const data = this.form.getRawValue();
    const formData = new FormData();
    formData.append('id', data.id || 0);
    formData.append('name', data.name);
    formData.append('default_price', data.default_price);
    formData.append('image_file', this.image_file);

    if (this.form.get('id').value) {
      console.log('inside the edit');
      this.snackService.editSnack(formData).subscribe(response => {
        if (response.error) {
          this.alertService.error(response.msg);
        } else {
          this.bsModalRef.hide();
          this.submitEvent.emit();
          this.alertService.success(response.msg);
        }
      });
    } else {
      this.snackService.newSnack(formData).subscribe(response => {
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

  // errorMessage(control: string, errorName: string) {
  //   return this.form.get(control).hasError(errorName) && (this.form.get(control).dirty || this.form.get(control).touched);
  // }

  onClose() {
    this.bsModalRef.hide();
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.patchValue({
          image_name: file.name
        });
        this.image_file = file;
      };
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
