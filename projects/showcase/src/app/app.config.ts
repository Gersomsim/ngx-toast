import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { NgxNotify } from '@gersomsim/ngx-notify';
import { ngxNotifyConfig } from '../../ngx-notify.config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    NgxNotify.provide(ngxNotifyConfig)
  ]
};
