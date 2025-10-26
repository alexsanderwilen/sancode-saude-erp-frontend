// Browser shims for libraries expecting Node globals
(window as any).global = (window as any).global || window;
(window as any).globalThis = (window as any).globalThis || window;
(window as any).process = (window as any).process || { env: {} };

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

// Firebase SDK (app + analytics, quando suportado e configurado)
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

ModuleRegistry.registerModules([ AllCommunityModule ]);

// Inicializa Firebase usando os valores do environment
const firebaseApp = initializeApp(environment.firebase);
if (environment.production && environment.firebase.measurementId) {
  // Analytics só em produção e quando o browser suportar
  isSupported()
    .then((ok) => { if (ok) getAnalytics(firebaseApp); })
    .catch(() => void 0);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

