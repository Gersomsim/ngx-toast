import { NgxNotifyType } from "../types";
import { NgxNotifyConfirmEvent } from "./confirm-event.interface";

export interface ConfirmConfig {
    title?: string;
    message?: string;
    // buttons
    cancelText?: string;
    confirmText?: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    // icon
    icon?: NgxNotifyType;
    // actions
    callback?: (event: NgxNotifyConfirmEvent) => void;
    // settings
    timer?: number;
    showTimerProgressBar?: boolean;
    showCloseButton?: boolean;
    closeBackdropClick?: boolean;
}