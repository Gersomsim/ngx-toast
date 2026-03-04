import { Component, computed, input } from '@angular/core';
import { NotifyPosition } from './notify-position.type';
import { NotifyType } from './notify.type';

@Component({
  selector: 'gsm-ngx-notify',
  imports: [],
  templateUrl: `./ngx-notify.html`,
  styleUrls: ['./ngx-notify.css', './styles/positions.css', './styles/colors.css'],
})
export class NgxNotify {
  message = input<string>('');
  type = input<NotifyType>('info');
  position = input<NotifyPosition>('top-right');
  title = input<string>('');
  withIcon = input<boolean>(true);
  withCloseButton = input<boolean>(true);
  icon = computed(() => {
    switch (this.type()) {
      case 'info':
        return 'I';
      case 'success':
        return 'S';
      case 'warning':
        return 'W';
      case 'error':
        return 'E';
    }
  });

  cssClass = computed(() => {
    return `${this.type()} ${this.position()}`;
  });
  
  

}
