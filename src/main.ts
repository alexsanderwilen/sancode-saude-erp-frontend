// Browser shims for libraries expecting Node globals
(window as any).global = (window as any).global || window;
(window as any).globalThis = (window as any).globalThis || window;
(window as any).process = (window as any).process || { env: {} };

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

ModuleRegistry.registerModules([ AllCommunityModule ]);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
