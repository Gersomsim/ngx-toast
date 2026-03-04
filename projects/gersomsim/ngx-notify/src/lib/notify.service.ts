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
    const { message, type, position, duration, animation } = config;
    const compRef = createComponent(NgxNotify, {
      environmentInjector: this.injector
    });

    compRef.setInput('message', message);
    compRef.setInput('type', type);
    compRef.setInput('position', position);
    compRef.setInput('title', config.title);
    compRef.setInput('withIcon', config.icon);
    compRef.setInput('withCloseButton', config.closeButton);
    if (animation) compRef.setInput('animation', animation);

    // close() en el componente ejecuta la animación de salida
    // y luego emite close$ — el servicio solo destruye al recibir close$.
    let isClosed = false;
    compRef.instance.close$.subscribe(() => {
      isClosed = true;
      this.destroy(compRef, config.onClose);
    });

    this.appRef.attachView(compRef.hostView);
    document.body.appendChild(compRef.location.nativeElement);

    // Al expirar el tiempo, disparar close() para que
    // la animación de salida se ejecute antes del destroy.
    const timeOnScreen = duration ?? 3000;
    setTimeout(() => {
      if (!isClosed) compRef.instance.close();
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