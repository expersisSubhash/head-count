import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackDayComponent } from './snack-day.component';

describe('SnackDayComponent', () => {
  let component: SnackDayComponent;
  let fixture: ComponentFixture<SnackDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
