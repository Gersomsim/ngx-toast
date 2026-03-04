import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from "@angular/core";
import { ConfigNotify } from "./config-notity.interface";
import { NgxNotify } from "./ngx-notify";

@Injectable({
    providedIn: 'root'
})
export class NotifyService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  
  show(config: ConfigNotify) {
    const { message, type, position, duration } = config;
    const compRef = createComponent(NgxNotify, {
      environmentInjector: this.injector
    })
    compRef.setInput('message', message);
    compRef.setInput('type', type);
    compRef.setInput('position', position);
    compRef.setInput('title', config.title);
    compRef.setInput('withIcon', config.icon);
    compRef.setInput('withCloseButton', config.closeButton);

    compRef.instance.close$.subscribe(() => {
      this.destroy(compRef, config.onClose);
    });
    
    this.appRef.attachView(compRef.hostView);
    document.body.appendChild(compRef.location.nativeElement);
    const timeOnScreen = duration || 3000;
    setTimeout(() => {
      this.destroy(compRef, config.onClose);
    }, timeOnScreen);
  }
  private destroy(compRef: ComponentRef<NgxNotify>, callback?: () => void) {
    this.appRef.detachView(compRef.hostView);
    compRef.destroy();
    if (callback) {
      callback();
    }
  }
}