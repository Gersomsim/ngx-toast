import { AnimationType, NotifyPosition, NotifyType } from "../types";

export interface ConfigNotify {
    message: string;
    type: NotifyType;
    position?: NotifyPosition;
    duration?:  number;
    animation?: AnimationType;
    title?: string;
    icon?: boolean;
    closeButton?: boolean;
    onClose?: () => void;
}