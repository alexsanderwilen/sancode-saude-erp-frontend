import { Routes } from '@angular/router';
import { PrestadoresListComponent } from './prestadores-list/prestadores-list.component';
import { PrestadoresFormComponent } from './prestadores-form/prestadores-form.component';

export const PRESTADORES_ROUTES: Routes = [
  {
    path: '',
    component: PrestadoresListComponent
  },
  {
    path: 'novo',
    component: PrestadoresFormComponent
  },
  {
    path: 'editar/:id',
    component: PrestadoresFormComponent
  }
];
