import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSender } from './notification-sender';

describe('NotificationSender', () => {
  let component: NotificationSender;
  let fixture: ComponentFixture<NotificationSender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
