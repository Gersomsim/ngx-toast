import { NgxNotifyConfirmEventType } from "../types";

export interface NgxNotifyConfirmEvent {
    type: NgxNotifyConfirmEventType;
    close: boolean;
    confirm: boolean;
    cancel: boolean;   
}