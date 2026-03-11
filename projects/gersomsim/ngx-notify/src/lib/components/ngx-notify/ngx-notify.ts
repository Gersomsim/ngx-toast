import { Component, computed, input, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxNotifyColorConfig } from '../../interfaces';
import { NgxNotifyAnimationType, NgxNotifyPositionType, NgxNotifyType } from '../../types';
import { NgxNotifyIcon } from '../ngx-notify-icon/ngx-notify-icon';

/* Duración de las animaciones de salida (ms).
 * Debe coincidir con los valores definidos en animations.css */
const EXIT_DURATION: Record<NgxNotifyAnimationType, number> = {
  fade:  180,
  slide: 200,
  zoom:  180,
  none:  0,
};

@Component({
  selector: 'gsm-ngx-notify',
  imports: [NgxNotifyIcon],
  templateUrl: `./ngx-notify.html`,
  styleUrls: [
    './ngx-notify.css',
    '../../styles/animations.css',
  ],
})
export class NgxNotify {
  close$ = new Subject<void>();

  message   = input<string>('');
  type      = input<NgxNotifyType>('info');
  position  = input<NgxNotifyPositionType>('top-right');
  title     = input<string>('');
  animation = input<NgxNotifyAnimationType>('slide');
  withIcon        = input<boolean>(true);
  withCloseButton = input<boolean>(true);

  colorsConfig = input<NgxNotifyColorConfig>({});

  colors = computed(() => {
    return {
      success: this.colorsConfig().successColor ?? '#22c55e',
      error: this.colorsConfig().errorColor ?? '#ef4444',
      warning: this.colorsConfig().warningColor ?? '#f59e0b',
      info: this.colorsConfig().infoColor ?? '#0ea5e9',
      mainBgColor: this.colorsConfig().mainBgColor ?? '#fff',
      mainTextColor: this.colorsConfig().mainTextColor ?? '#40444dff'
    }
  });


  private closing = signal(false);

  cssClass = computed(() => {
    const exit = this.closing() ? 'notify--exit' : '';
    return `notify ${this.position()} anim-${this.animation()} ${exit}`.trim();
  });

  close() {
    this.closing.set(true);
    setTimeout(() => {
      this.close$.next();
      this.close$.complete();
    }, EXIT_DURATION[this.animation()]);
  }
}
