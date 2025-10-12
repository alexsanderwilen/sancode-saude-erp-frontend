import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout';
import { ModuleLayoutComponent } from './core/layouts/module-layout/module-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // This layout includes the main toolbar
    children: [
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: '', // This path is empty to allow 'cadastros' to be a top-level route
    component: ModuleLayoutComponent, // This layout is just a router-outlet for full-screen modules
    children: [
      {
        path: 'cadastros',
        loadChildren: () => import('./modules/cadastros/cadastros.routes').then(m => m.CADASTROS_ROUTES)
      }
      // Future modules like 'financeiro' will go here, using ModuleLayoutComponent
    ]
  },
  // Catch-all route for any unmatched paths
  { path: '**', redirectTo: 'home' }
];