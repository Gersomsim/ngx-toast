// notify-service-internal.ts
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injector
} from '@angular/core';
import { NgxNotify } from '../components';
import { NgxNotifyContainer } from '../components/ngx-notify-container/ngx-notify-container';
import { BtnColors, ColorConfig, ConfigNotify } from '../interfaces';
import { NotifyPosition } from '../types';

type colors = Partial<BtnColors & ColorConfig>

export class NotifyServiceInternal {
  private appRef: ApplicationRef;
  private injector: EnvironmentInjector;
  
  /**
   * Mapa de contenedores por posición
   * Cada contenedor tiene su referencia y un Set de notificaciones activas
   */
  private containers = new Map<NotifyPosition, {
    containerRef: ComponentRef<NgxNotifyContainer>;
    notifications: Set<ComponentRef<NgxNotify>>;
  }>();

  /**
   * Configuración por defecto
   */
  private defaultConfig: Partial<ConfigNotify> = {
    duration: 3000,
    position: 'top-right',
    closeButton: true,
    icon: true,
    animation: 'fade'
  };

  private ngxColors: colors = {}

  constructor(injector: Injector, defaultConfig?: Partial<ConfigNotify>, colors?: colors) {
    this.appRef = injector.get(ApplicationRef);
    this.injector = injector.get(EnvironmentInjector);
    
    if (defaultConfig) {
      this.defaultConfig = { ...this.defaultConfig, ...defaultConfig };
    }

    if (colors) {
      this.ngxColors = { ...colors };
    }
  }

  /**
   * Actualizar configuración por defecto
   */
  setDefaultConfig(config: Partial<ConfigNotify>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Mostrar una notificación
   */
  show(userConfig: ConfigNotify): void {
    // Verificar que estamos en el navegador (para SSR)
    if (typeof document === 'undefined') {
      console.warn('NgxNotify: No se puede mostrar notificación en SSR');
      return;
    }

    // Fusionar configuración
    const config = { ...this.defaultConfig, ...userConfig } as ConfigNotify;
    const position = config.position ?? 'top-right';

    // Obtener o crear contenedor para esta posición
    const containerData = this.getOrCreateContainer(position);
    
    // Crear la notificación
    const compRef = this.createNotification(config);

    // Adjuntar al DOM del contenedor
    containerData.containerRef.location.nativeElement.appendChild(
      compRef.location.nativeElement
    );
    
    // Registrar la notificación en el contenedor
    containerData.notifications.add(compRef);

    let isClosed = false;

    compRef.instance.close$.subscribe(() => {
      isClosed = true;
      this.destroyNotification(compRef, position, config.onClose);
    });

    const timeOnScreen = config.duration ?? 3000;
    setTimeout(() => {
      if (!isClosed) compRef.instance.close();
    }, timeOnScreen);
  }

  /**
   * Cerrar todas las notificaciones
   */
  closeAll(): void {
    this.containers.forEach((containerData, position) => {
      const notifications = Array.from(containerData.notifications);
      notifications.forEach(compRef => {
        compRef.instance.close();
      });
    });
  }

  /**
   * Cerrar la notificación más reciente de una posición
   */
  closeLatest(position: NotifyPosition): void {
    const containerData = this.containers.get(position);
    if (containerData && containerData.notifications.size > 0) {
      const notifications = Array.from(containerData.notifications);
      const latest = notifications[notifications.length - 1];
      latest.instance.close();
    }
  }


  /**
   * Destruir todos los contenedores y notificaciones
   */
  destroy(): void {
    this.closeAll();
    this.containers.forEach((containerData, position) => {
      this.destroyContainer(position);
    });
  }

  // ---------------------------------------------------------------------------
  // Métodos privados
  // ---------------------------------------------------------------------------

  /**
   * Obtener o crear un contenedor para una posición específica
   */
  private getOrCreateContainer(position: NotifyPosition) {
    if (!this.containers.has(position)) {
      // Crear el contenedor
      const containerRef = createComponent(NgxNotifyContainer, {
        environmentInjector: this.injector,
      });

      // Configurar el contenedor
      containerRef.setInput('position', position);
      
      // Adjuntar a la aplicación
      this.appRef.attachView(containerRef.hostView);
      
      // Agregar al DOM
      document.body.appendChild(containerRef.location.nativeElement);

      // Guardar en el mapa
      this.containers.set(position, {
        containerRef,
        notifications: new Set()
      });

      // Limpiar cuando se destruya el contenedor
      containerRef.onDestroy(() => {
        this.containers.delete(position);
      });
    }
    
    return this.containers.get(position)!;
  }

  /**
   * Crear un componente de notificación
   */
  private createNotification(config: ConfigNotify): ComponentRef<NgxNotify> {
    const compRef = createComponent(NgxNotify, {
      environmentInjector: this.injector,
    });

    // Configurar inputs
    compRef.setInput('message', config.message);
    compRef.setInput('type', config.type || 'info');
    compRef.setInput('position', config.position);
    compRef.setInput('title', config.title || '');
    compRef.setInput('withIcon', config.icon ?? true);
    compRef.setInput('withCloseButton', config.closeButton ?? true);
    
    if (config.animation) {
      compRef.setInput('animation', config.animation);
    }

    if (this.ngxColors) {
      compRef.setInput('colorsConfig', {
        successColor: this.ngxColors.successColor,
        errorColor: this.ngxColors.errorColor,
        warningColor: this.ngxColors.warningColor,
        infoColor: this.ngxColors.infoColor,
        mainBgColor: this.ngxColors.mainBgColor,
        mainTextColor: this.ngxColors.mainTextColor,
      });
    }

    // Adjuntar a la aplicación
    this.appRef.attachView(compRef.hostView);

    return compRef;
  }

  /**
   * Destruir una notificación específica
   */
  private destroyNotification(
    compRef: ComponentRef<NgxNotify>,
    position: NotifyPosition,
    onClose?: () => void
  ): void {
    const containerData = this.containers.get(position);
    if (!containerData) return;

    // Verificar si la notificación aún está en el contenedor
    if (containerData.notifications.has(compRef)) {
      // Desadjuntar y destruir
      this.appRef.detachView(compRef.hostView);
      compRef.destroy();
      
      // Eliminar del registro
      containerData.notifications.delete(compRef);
      
      // Ejecutar callback onClose
      onClose?.();

      // Si el contenedor quedó vacío, destruirlo
      if (containerData.notifications.size === 0) {
        this.destroyContainer(position);
      }
    }
  }

  /**
   * Destruir un contenedor completo
   */
  private destroyContainer(position: NotifyPosition): void {
    const containerData = this.containers.get(position);
    if (containerData) {
      // Asegurarse de que no queden notificaciones
      if (containerData.notifications.size > 0) {
        const notifications = Array.from(containerData.notifications);
        notifications.forEach(compRef => {
          this.appRef.detachView(compRef.hostView);
          compRef.destroy();
        });
        containerData.notifications.clear();
      }

      // Destruir el contenedor
      this.appRef.detachView(containerData.containerRef.hostView);
      containerData.containerRef.destroy();
      
      // Eliminar del mapa
      this.containers.delete(position);
    }
  }



}