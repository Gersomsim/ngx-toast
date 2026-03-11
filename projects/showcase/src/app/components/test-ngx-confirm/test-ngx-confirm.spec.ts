import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNgxConfirm } from './test-ngx-confirm';

describe('TestNgxConfirm', () => {
  let component: TestNgxConfirm;
  let fixture: ComponentFixture<TestNgxConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestNgxConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNgxConfirm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
