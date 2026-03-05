import { NotifyType } from "../types";

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
    onConfirm?: () => void;
    onCancel?: () => void;
    // settings
    timer?: number;
    showTimerProgressBar?: boolean;
    showCloseButton?: boolean;
}