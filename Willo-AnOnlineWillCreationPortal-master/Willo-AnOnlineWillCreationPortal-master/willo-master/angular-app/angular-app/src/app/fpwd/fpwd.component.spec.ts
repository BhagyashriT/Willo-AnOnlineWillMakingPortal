import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpwdComponent } from './fpwd.component';

describe('FpwdComponent', () => {
  let component: FpwdComponent;
  let fixture: ComponentFixture<FpwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
