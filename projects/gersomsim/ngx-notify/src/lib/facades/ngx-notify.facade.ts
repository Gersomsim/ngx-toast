// ngx-notify.facade.ts
import { inject, Injector, provideAppInitializer } from '@angular/core';
import { BtnColors, ColorConfig, ConfigNotify, ConfirmConfig, NgxNotifyConfig } from '../interfaces';
import { NotifyServiceInternal } from '../services/notify-internal.service';
import { NotifyPosition, NotifyType } from '../types';

type colors = Partial<BtnColors & ColorConfig>

export class NgxNotify {
  
  private static instance: NotifyServiceInternal;
  private static injector: Injector;
  private static defaultConfig: Partial<ConfigNotify> = {
    duration: 3000,
    position: 'top-right',
    closeButton: true,
    icon: true,
    animation: 'fade',
    type: 'info'
  };
  private static ngxColors: colors = {}
  
  private static isBrowser = typeof document !== 'undefined' && 
                             typeof window !== 'undefined' && 
                             window.document;
  
  private static initialized = false;
  private static initPromise: Promise<void> | null = null;

  static init(injector: Injector, config?: Partial<NgxNotifyConfig>): void {
    
    if (this.initialized) {
      console.warn('NgxNotify ya está inicializado. Llamar a init() nuevamente actualizará la configuración.');
      if (config) {
        const {toast } = config;
        this.setDefaultConfig({
          duration: config.timer,
          ...toast
        });
        this.setColors({...config});
      }
      return;
    }

    if (!injector) {
      throw new Error('NgxNotify.init() requiere un Injector válido');
    }

    this.injector = injector;
    
    if (config) {
      const {toast } = config;
      this.defaultConfig = { ...this.defaultConfig, ...toast };
      this.setColors({...config});
    }

    // Crear instancia del servicio interno
    try {
      this.instance = new NotifyServiceInternal(injector, this.defaultConfig, this.ngxColors);
      this.initialized = true;
      
      // Registrar para limpieza al recargar página (opcional)
      if (this.isBrowser) {
        window.addEventListener('beforeunload', () => {
          this.destroy();
        });
      }
    } catch (error) {
      console.error('❌ Error al inicializar NgxNotify:', error);
      throw error;
    }
  }

  /**
   * Inicialización asíncrona (útil para lazy loading)
   */
  static async initAsync(injector: Injector, config?: Partial<NgxNotifyConfig>): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve) => {
      // Pequeño delay para no bloquear el hilo principal
      setTimeout(() => {
        this.init(injector, config);
        resolve();
      }, 0);
    });

    return this.initPromise;
  }

  /**
   * Verifica si NgxNotify está inicializado
   */
  static isInitialized(): boolean {
    return this.initialized && !!this.instance;
  }

  /**
   * Espera a que NgxNotify esté inicializado
   */
  static async waitForInit(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;
    throw new Error('NgxNotify no ha sido inicializado. Llama a init() primero.');
  }

  static setColors(colors: Partial<BtnColors & ColorConfig>): void {
    this.ngxColors = { ...this.ngxColors, ...colors };
  }

  /**
   * Actualiza la configuración por defecto global
   */
  static setDefaultConfig(config: Partial<ConfigNotify>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
    
    if (this.instance) {
      this.instance.setDefaultConfig(this.defaultConfig);
    }
  }

  /**
   * Obtiene la configuración por defecto actual
   */
  static getDefaultConfig(): Partial<ConfigNotify> {
    return { ...this.defaultConfig };
  }

  // ---------------------------------------------------------------------------
  // Métodos principales de notificación
  // ---------------------------------------------------------------------------


  static show(config: ConfigNotify): void {
    if (!this.checkInitialized()) return;
    
    // Validaciones básicas
    if (!config.message) {
      console.error('NgxNotify: El mensaje es requerido');
      return;
    }

    try {
      this.instance.show(config);
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
  }

  /**
   * Muestra una notificación de éxito
   */
  static success(message: string, config?: Partial<ConfigNotify>): void {
    this.show({
      message,
      type: 'success',
      icon: true,
      ...config
    });
  }

  /**
   * Muestra una notificación de error
   */
  static error(message: string, config?: Partial<ConfigNotify>): void {
    this.show({
      message,
      type: 'error',
      duration: 5000, // Por defecto más tiempo para errores
      icon: true,
      ...config
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  static warning(message: string, config?: Partial<ConfigNotify>): void {
    this.show({
      message,
      type: 'warning',
      icon: true,
      duration: 4000,
      ...config
    });
  }

  /**
   * Muestra una notificación informativa
   */
  static info(message: string, config?: Partial<ConfigNotify>): void {
    this.show({
      message,
      type: 'info',
      icon: true,
      ...config
    });
  }

  // ---------------------------------------------------------------------------
  // Métodos de conveniencia con posiciones específicas
  // ---------------------------------------------------------------------------

  static successAt(message: string, position: NotifyPosition, config?: Partial<ConfigNotify>): void {
    this.success(message, { position, ...config });
  }

  static errorAt(message: string, position: NotifyPosition, config?: Partial<ConfigNotify>): void {
    this.error(message, { position, ...config });
  }

  static warningAt(message: string, position: NotifyPosition, config?: Partial<ConfigNotify>): void {
    this.warning(message, { position, ...config });
  }

  static infoAt(message: string, position: NotifyPosition, config?: Partial<ConfigNotify>): void {
    this.info(message, { position, ...config });
  }

  // ---------------------------------------------------------------------------
  // Métodos de control de notificaciones
  // ---------------------------------------------------------------------------

  static confirm(config: Partial<ConfirmConfig>): void {
    if (!this.checkInitialized()) return;
    this.instance.confirm(config);
  }

  /**
   * Cierra todas las notificaciones activas
   */
  static closeAll(): void {
    if (!this.checkInitialized()) return;
    this.instance.closeAll();
  }

  /**
   * Destruye todas las notificaciones y limpia recursos
   */
  static destroy(): void {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null as any;
      this.initialized = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Métodos para integración con Angular
  // ---------------------------------------------------------------------------

  /**
   * Crea un provider para inicializar NgxNotify en app.config.ts
   * 
   * @example
   * // app.config.ts
   * export const appConfig = {
   *   providers: [
   *     NgxNotify.provide({ duration: 5000 })
   *   ]
   * };
   */
  static provide(config?: Partial<NgxNotifyConfig>) {
    return provideAppInitializer(() => {
      NgxNotify.init(inject(Injector), config);
    });
  }

  /**
   * Versión async del provider
   */
  static provideAsync(config?: Partial<NgxNotifyConfig>) {
    return provideAppInitializer(async () => {
      await NgxNotify.initAsync(inject(Injector), config);
    });
  }

  // ---------------------------------------------------------------------------
  // Métodos para debugging y desarrollo
  // ---------------------------------------------------------------------------

  /**
   * Muestra una notificación de prueba con todas las configuraciones
   */
  static demo(): void {
    const types: NotifyType[] = ['success', 'error', 'warning', 'info'];
    const positions: NotifyPosition[] = [
      'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
    ];
    
    let delay = 0;
    
    types.forEach((type, index) => {
      setTimeout(() => {
        NgxNotify.show({
          message: `Notificación de tipo: ${type}`,
          type,
          title: `Título ${type}`,
          position: positions[index % positions.length],
          duration: 3000,
          closeButton: true,
          icon: true,
          onClose: () => console.log(`Cerrada notificación ${type}`)
        });
      }, delay);
      
      delay += 500;
    });
    
    // Demostrar múltiples notificaciones en misma posición
    setTimeout(() => {
      NgxNotify.success('Primera notificación en top-right');
      NgxNotify.info('Segunda notificación en top-right');
      NgxNotify.warning('Tercera notificación en top-right');
    }, delay + 1000);
  }

  // ---------------------------------------------------------------------------
  // Métodos privados de utilidad
  // ---------------------------------------------------------------------------

  /**
   * Verifica si la librería está inicializada y muestra error si no
   */
  private static checkInitialized(): boolean {
    if (!this.isBrowser) {
      console.warn('NgxNotify: No se puede usar en SSR');
      return false;
    }

    if (!this.initialized || !this.instance) {
      console.error(
        'NgxNotify no está inicializado. ' +
        'Asegúrate de llamar a NgxNotify.init(injector) en tu app.config.ts ' +
        'o usar NgxNotify.provide()'
      );
      
      // Intento de recuperación: buscar injector global
      if (this.isBrowser && !this.instance) {
        this.tryAutoInit();
      }
      
      return false;
    }
    
    return true;
  }

  /**
   * Intenta inicializar automáticamente (último recurso)
   */
  private static tryAutoInit(): void {
    if (!this.isBrowser) return;
    
    try {
      // Buscar el injector raíz de Angular en el contexto global
      const ng = (window as any).ng;
      if (ng && ng.probe && ng.probe.injector) {
        this.init(ng.probe.injector);
        console.log('✅ NgxNotify inicializado automáticamente');
      }
    } catch (e) {
      // Silenciar error en auto-init
    }
  }
}
