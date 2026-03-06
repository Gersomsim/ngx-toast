import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNgxNotify } from './test-ngx-notify';

describe('TestNgxNotify', () => {
  let component: TestNgxNotify;
  let fixture: ComponentFixture<TestNgxNotify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestNgxNotify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNgxNotify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
