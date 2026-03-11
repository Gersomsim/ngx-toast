import { Component, input } from '@angular/core';
import { NgxNotifyType } from '../../types';

@Component({
  selector: 'gsm-notify-icon',
  templateUrl: './ngx-notify-icon.html',
  styleUrls: ['./ngx-notify-icon.css'],
  /*
   * host: { '[class]': 'type()' }
   * Agrega la clase del tipo (info/success/warning/error) al elemento host.
   * Esto permite que :host(.success), :host(.error), etc. en icons.css
   * apliquen las animaciones correctas sin cruzar el boundary del componente.
   */
  host: { 
    '[class]': 'type()', 
    '[style.stroke]': 'color()' 
  },
})
export class NgxNotifyIcon {
  type = input<NgxNotifyType>('info');
  color = input<string>('');
}
