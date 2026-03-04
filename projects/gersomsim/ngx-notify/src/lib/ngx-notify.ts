import { Component, computed, input, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { NotifyPosition } from './notify-position.type';
import { NotifyType } from './notify.type';
import { AnimationType } from './types/animation.type';

/* Duración de las animaciones de salida (ms).
 * Debe coincidir con los valores definidos en animations.css */
const EXIT_DURATION: Record<AnimationType, number> = {
  fade:  180,
  slide: 200,
  zoom:  180,
  none:  0,
};

@Component({
  selector: 'gsm-ngx-notify',
  imports: [],
  templateUrl: `./ngx-notify.html`,
  styleUrls: [
    './ngx-notify.css',
    './styles/positions.css',
    './styles/colors.css',
    './styles/animations.css',
  ],
})
export class NgxNotify {
  close$ = new Subject<void>();

  message   = input<string>('');
  type      = input<NotifyType>('info');
  position  = input<NotifyPosition>('top-right');
  title     = input<string>('');
  animation = input<AnimationType>('slide');
  withIcon        = input<boolean>(true);
  withCloseButton = input<boolean>(true);

  private closing = signal(false);

  icon = computed(() => {
    switch (this.type()) {
      case 'info':    return 'I';
      case 'success': return 'S';
      case 'warning': return 'W';
      case 'error':   return 'E';
    }
  });

  cssClass = computed(() => {
    const exit = this.closing() ? 'notify--exit' : '';
    return `notify ${this.type()} ${this.position()} anim-${this.animation()} ${exit}`.trim();
  });

  close() {
    this.closing.set(true);
    setTimeout(() => {
      this.close$.next();
      this.close$.complete();
    }, EXIT_DURATION[this.animation()]);
  }
}
