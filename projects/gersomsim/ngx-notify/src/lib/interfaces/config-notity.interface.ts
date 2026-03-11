import { NgxNotifyAnimationType, NgxNotifyPositionType, NgxNotifyType } from "../types";

export interface NgxNotifyToastConfig {
    message: string;
    type: NgxNotifyType;
    position?: NgxNotifyPositionType;
    duration?:  number;
    animation?: NgxNotifyAnimationType;
    title?: string;
    icon?: boolean;
    closeButton?: boolean;
    onClose?: () => void;
}