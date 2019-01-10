import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSnacksDetailComponent } from './user-snacks-detail.component';

describe('UserSnacksDetailComponent', () => {
  let component: UserSnacksDetailComponent;
  let fixture: ComponentFixture<UserSnacksDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSnacksDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSnacksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
