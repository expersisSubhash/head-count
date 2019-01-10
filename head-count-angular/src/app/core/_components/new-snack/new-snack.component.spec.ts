import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSnackComponent } from './new-snack.component';

describe('NewSnackComponent', () => {
  let component: NewSnackComponent;
  let fixture: ComponentFixture<NewSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
