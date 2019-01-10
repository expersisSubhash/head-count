import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnacksListComponent } from './snacks-list.component';

describe('SnacksListComponent', () => {
  let component: SnacksListComponent;
  let fixture: ComponentFixture<SnacksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnacksListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnacksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
