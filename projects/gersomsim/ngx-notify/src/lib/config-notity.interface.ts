import { AnimationType } from "./types/animation.type";
import { NotifyPosition } from "./notify-position.type";
import { NotifyType } from "./notify.type";

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