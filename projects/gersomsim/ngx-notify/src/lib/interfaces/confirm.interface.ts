import { NotifyType } from "../types";
import { ConfirmEvent } from "./confirm-event.interface";

export interface ConfirmConfig {
    title?: string;
    message?: string;
    // buttons
    cancelText?: string;
    confirmText?: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    // icon
    icon?: NotifyType;
    // actions
    callback?: (event: ConfirmEvent) => void;
    // settings
    timer?: number;
    showTimerProgressBar?: boolean;
    showCloseButton?: boolean;
    closeBackdropClick?: boolean;
}