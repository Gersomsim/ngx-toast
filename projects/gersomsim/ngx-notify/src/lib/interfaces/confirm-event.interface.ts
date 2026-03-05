import { ConfirmEventType } from "../types";

export interface ConfirmEvent {
    type: ConfirmEventType;
    close: boolean;
    confirm: boolean;
    cancel: boolean;   
}