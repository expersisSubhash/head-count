import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAlertBoxComponent } from './confirm-alert-box.component';

describe('ConfirmAlertBoxComponent', () => {
  let component: ConfirmAlertBoxComponent;
  let fixture: ComponentFixture<ConfirmAlertBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAlertBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAlertBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
