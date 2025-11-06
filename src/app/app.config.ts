import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Habilita logs detalhados de navegação no console do browser
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([jwtInterceptor, loadingInterceptor])),
    provideNgxMask(),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true } }
  ]
};

