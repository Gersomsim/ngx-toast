import { Component, computed, input, signal } from "@angular/core";
import { Subject } from "rxjs";
import { BtnColors, ColorConfig } from "../../interfaces";
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
    confirmText       = input<string>('Confirm');
    showTimerProgressBar = input<boolean>(true);
    timer             = input<number>(5000);
    showCloseButton   = input<boolean>(true);
    closeBackdropClick = input<boolean>(true);
    colorsConfig = input<ColorConfig>({});

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
    btnColorsConfig = input<BtnColors>({})

    btnColors = computed(() => {
        const mainBg = this.colors().mainBgColor;
        const colorBtnCancel = mainBg === '#fff' ? 'transparent' : '#fff';
        const colorBtnCancelBorder = mainBg === '#fff' ? '#e5e7eb' : '#fff';
        return {
            confirmColor: this.btnColorsConfig().confirmBtnColor ?? '#111827',
            confirmTextColor: this.btnColorsConfig().confirmBtnTextColor ?? '#ffffff',
            cancelColor: this.btnColorsConfig().cancelBtnColor ?? colorBtnCancel,
            cancelBorderColor: this.btnColorsConfig().cancelBtnColor ?? colorBtnCancelBorder,
            cancelTextColor: this.btnColorsConfig().cancelBtnTextColor ?? '#374151',            
        }
    });


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
