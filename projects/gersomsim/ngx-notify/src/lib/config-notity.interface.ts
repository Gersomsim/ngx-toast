import { AnimationType } from "./types/animation.type";
import { NotifyPosition } from "./types/notify-position.type";
import { NotifyType } from "./types/notify.type";

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