import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from "@angular/core";
import { NgxConfirm as NgxConfirmComponent } from "../components";
import { ConfirmConfig, ConfirmEvent } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class NgxConfirmService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

 configuration: ConfirmConfig = {
    title: '',
    message: '',
    icon: 'info',
    showCancelButton: false,
    cancelText: 'Cancel',
    showConfirmButton: true,
    confirmText: 'Confirm',
    showTimerProgressBar: false,
    closeBackdropClick: false,
 }

  show(configInit: Partial<ConfirmConfig>): void {
    const config: ConfirmConfig = { ...this.configuration, ...configInit };
    const compRef = createComponent(NgxConfirmComponent, {
      environmentInjector: this.injector,
    })
    compRef.setInput('title',                 config.title);
    compRef.setInput('message',               config.message);
    compRef.setInput('icon',                  config.icon);
    compRef.setInput('showCancelButton',      config.showCancelButton);
    compRef.setInput('cancelText',            config.cancelText);
    compRef.setInput('showConfirmButton',     config.showConfirmButton);
    compRef.setInput('confirmText',           config.confirmText);
    compRef.setInput('showTimerProgressBar',  config.showTimerProgressBar);
    compRef.setInput('timer',                 config.timer);
    compRef.setInput('closeBackdropClick',    config.closeBackdropClick);

    this.appRef.attachView(compRef.hostView);
    document.body.appendChild(compRef.location.nativeElement);

    let isClosed = false;

    compRef.instance.close$
      .subscribe((event: ConfirmEvent) => {
        isClosed = true;
        config.callback?.(event);
        this.destroyConfirm(compRef);
    });

    if(!config.showConfirmButton && !config.showCancelButton) {
      const timeOnScreen = config.timer ?? 5000;
      setTimeout(() => {
        if (!isClosed) compRef.instance.close('close');
      }, timeOnScreen);
    }
    
  }

  destroyConfirm(compRef: ComponentRef<NgxConfirmComponent>): void {
    this.appRef.detachView(compRef.hostView);
    compRef.destroy();
  }
     
}