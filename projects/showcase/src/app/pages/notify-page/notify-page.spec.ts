import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyPage } from './notify-page';

describe('NotifyPage', () => {
  let component: NotifyPage;
  let fixture: ComponentFixture<NotifyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifyPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
