import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyParkingComponent } from './my-parking.component';

describe('MyParkingComponent', () => {
  let component: MyParkingComponent;
  let fixture: ComponentFixture<MyParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
