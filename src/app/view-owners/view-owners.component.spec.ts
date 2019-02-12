import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOwnersComponent } from './view-owners.component';

describe('ViewOwnersComponent', () => {
  let component: ViewOwnersComponent;
  let fixture: ComponentFixture<ViewOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
