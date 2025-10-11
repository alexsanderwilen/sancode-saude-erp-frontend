import { Routes } from '@angular/router';
import { CadastrosHomeComponent } from './cadastros-home/cadastros-home';
import { OperadorasListComponent } from './operadoras-list/operadoras-list';
import { OperadorasFormComponent } from './operadoras-form/operadoras-form';

export const CADASTROS_ROUTES: Routes = [
  {
    path: '',
    component: CadastrosHomeComponent,
    children: [
      { path: '', redirectTo: 'operadoras', pathMatch: 'full' },
      { path: 'operadoras', component: OperadorasListComponent },
      { path: 'operadoras/nova', component: OperadorasFormComponent },
      { path: 'operadoras/editar/:id', component: OperadorasFormComponent }
    ]
  }
];
