import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxToast } from './ngx-toast';

describe('NgxToast', () => {
  let component: NgxToast;
  let fixture: ComponentFixture<NgxToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxToast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
