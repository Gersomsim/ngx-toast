import { Component, computed, input, signal } from "@angular/core";
import { Subject } from "rxjs";
import { ConfirmEventType } from "../../enums";
import { NgxNotifyColorConfig, NgxNotifyConfirmButtonColors, NgxNotifyConfirmEvent } from "../../interfaces";
import { NgxNotifyConfirmEventType, NgxNotifyType } from "../../types";
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
    icon              = input<NgxNotifyType>();
    showCancelButton  = input<boolean>(false);
    cancelText        = input<string>('Cancel');
    showConfirmButton = input<boolean>(false);
    confirmText       = input<string>('Confirm');
    showTimerProgressBar = input<boolean>(true);
    timer             = input<number>(5000);
    showCloseButton   = input<boolean>(true);
    closeBackdropClick = input<boolean>(true);
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
    btnColorsConfig = input<NgxNotifyConfirmButtonColors>({})

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


    close$ = new Subject<NgxNotifyConfirmEvent>();

    private closing = signal(false);

    /* Clase del backdrop — añade .confirm--exit para disparar el fade-out */
    backdropClass = computed(() =>
        this.closing() ? 'backdrop confirm--exit' : 'backdrop'
    );

    close(type: NgxNotifyConfirmEventType) {
        if(!this.closeBackdropClick() && type === ConfirmEventType.BackdropClick) {
            return;
        }
        const eventToEmit: NgxNotifyConfirmEvent = {
            type: type,
            close: type === ConfirmEventType.Close,
            confirm: type === ConfirmEventType.Confirm,
            cancel: type === ConfirmEventType.Cancel,
        };        
        this.closing.set(true);
        setTimeout(() => {
            this.close$.next(eventToEmit);
            this.close$.complete();
        }, EXIT_DURATION);
    }
}
