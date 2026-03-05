import { Component, input, ViewEncapsulation } from '@angular/core';
import { NotifyPosition } from '../types';

@Component({
  selector: 'gsm-notify-container',
  template: '',
  styleUrls: ['./ngx-notify-container.css'],
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"notify-container " + position()' },
})
export class NgxNotifyContainer {
  position = input<NotifyPosition>('top-right');
}
