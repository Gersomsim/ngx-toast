import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPage } from './confirm-page';

describe('ConfirmPage', () => {
  let component: ConfirmPage;
  let fixture: ComponentFixture<ConfirmPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
