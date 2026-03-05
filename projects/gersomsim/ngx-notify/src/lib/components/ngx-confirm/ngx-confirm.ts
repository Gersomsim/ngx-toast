import { Component, computed, input, signal } from "@angular/core";
import { Subject } from "rxjs";
import { ConfirmEvent } from "../../interfaces/confirm-event.interface";
import { ConfirmEventType, NotifyType } from "../../types";
import { NgxNotifyIcon } from "../ngx-notify-icon/ngx-notify-icon";



/* Duración del fade-out (ms) — debe coincidir con animations.css */
const EXIT_DURATION = 180;

@Component({
    selector: 'gsm-ngx-confirm',
    imports: [NgxNotifyIcon],
    templateUrl: './ngx-confirm.html',
    styleUrls: [
      './ngx-confirm.css',
      '../../styles/animations.css', // reutiliza notify-fade-in / notify-fade-out
    ],
})
export class NgxConfirm {
    title             = input<string>('');
    message           = input<string>('');
    icon              = input<NotifyType>();
    showCancelButton  = input<boolean>(false);
    cancelText        = input<string>('Cancel');
    showConfirmButton = input<boolean>(false);
    confirmText       = input<string>('Aceptar');
    showTimerProgressBar = input<boolean>(true);
    timer             = input<number>(5000);
    showCloseButton   = input<boolean>(true);
    closeBackdropClick = input<boolean>(true);

    close$ = new Subject<ConfirmEvent>();

    private closing = signal(false);

    /* Clase del backdrop — añade .confirm--exit para disparar el fade-out */
    backdropClass = computed(() =>
        this.closing() ? 'backdrop confirm--exit' : 'backdrop'
    );

    close(type: ConfirmEventType) {
        if(!this.closeBackdropClick() && type === 'backdropClick') {
            return;
        }
        const eventToEmit: ConfirmEvent = {
            type: type,
            close: type === 'close',
            confirm: type === 'confirm',
            cancel: type === 'cancel',
        };        
        this.closing.set(true);
        setTimeout(() => {
            this.close$.next(eventToEmit);
            this.close$.complete();
        }, EXIT_DURATION);
    }
}
