import { NotifyPosition } from "./notify-position.type";
import { NotifyType } from "./notify.type";

export interface ConfigNotify {
    message: string;
    type: NotifyType;
    position?: NotifyPosition;
    duration?: number;
    title?: string;
    icon?: boolean;
    closeButton?: boolean;
    onClose?: () => void;
}