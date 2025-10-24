import { Routes } from '@angular/router';
import { PlanoListComponent } from './plano-list/plano-list.component';
import { PlanoFormComponent } from './plano-form/plano-form.component';

export const PLANO_ROUTES: Routes = [
  {
    path: '',
    component: PlanoListComponent
  },
  {
    path: 'novo',
    component: PlanoFormComponent
  },
  {
    path: 'editar/:id',
    component: PlanoFormComponent
  }
];
