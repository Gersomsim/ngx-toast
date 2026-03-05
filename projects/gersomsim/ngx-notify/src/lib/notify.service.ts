import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';
import { NgxNotify, NgxNotifyContainer } from './components';
import { ConfigNotify } from './config-notity.interface';
import { NotifyPosition } from './types';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  private appRef  = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  /**
   * Un contenedor por posición.
   * Se crea la primera vez que se muestra una notificación en esa posición
   * y se destruye cuando queda vacío.
   */
  private containers = new Map<NotifyPosition, ComponentRef<NgxNotifyContainer>>();

  show(config: ConfigNotify) {
    const position = config.position ?? 'top-right';

    const container = this.getOrCreateContainer(position);
    const compRef   = this.createNotification(config);

    // Adjuntar la notificación como hijo DOM del contenedor
    container.location.nativeElement.appendChild(compRef.location.nativeElement);

    let isClosed = false;
    compRef.instance.close$.subscribe(() => {
      isClosed = true;
      this.destroyNotification(compRef, container, config.onClose);
    });

    const timeOnScreen = config.duration ?? 3000;
    setTimeout(() => {
      if (!isClosed) compRef.instance.close();
    }, timeOnScreen);
  }

  // ---------------------------------------------------------------------------

  private getOrCreateContainer(position: NotifyPosition): ComponentRef<NgxNotifyContainer> {
    if (!this.containers.has(position)) {
      const containerRef = createComponent(NgxNotifyContainer, {
        environmentInjector: this.injector,
      });
      containerRef.setInput('position', position);
      this.appRef.attachView(containerRef.hostView);
      document.body.appendChild(containerRef.location.nativeElement);
      this.containers.set(position, containerRef);
    }
    return this.containers.get(position)!;
  }

  private createNotification(config: ConfigNotify): ComponentRef<NgxNotify> {
    const compRef = createComponent(NgxNotify, {
      environmentInjector: this.injector,
    });
    compRef.setInput('message',         config.message);
    compRef.setInput('type',            config.type);
    compRef.setInput('position',        config.position);
    compRef.setInput('title',           config.title);
    compRef.setInput('withIcon',        config.icon);
    compRef.setInput('withCloseButton', config.closeButton);
    if (config.animation) compRef.setInput('animation', config.animation);
    this.appRef.attachView(compRef.hostView);
    return compRef;
  }

  private destroyNotification(
    compRef: ComponentRef<NgxNotify>,
    container: ComponentRef<NgxNotifyContainer>,
    onClose?: () => void,
  ) {
    this.appRef.detachView(compRef.hostView);
    compRef.destroy();
    onClose?.();

    // Si el contenedor quedó vacío, destruirlo y sacarlo del mapa
    if (!container.location.nativeElement.hasChildNodes()) {
      this.appRef.detachView(container.hostView);
      container.destroy();
      this.containers.forEach((ref, pos) => {
        if (ref === container) this.containers.delete(pos);
      });
    }
  }
}
