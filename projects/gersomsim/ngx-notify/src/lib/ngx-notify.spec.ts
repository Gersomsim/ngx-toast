import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxNotify } from './ngx-notify';

describe('NgxNotify', () => {
  let component: NgxNotify;
  let fixture: ComponentFixture<NgxNotify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxNotify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxNotify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
