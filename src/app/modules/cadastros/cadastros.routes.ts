import { Routes } from '@angular/router';
import { CadastrosLayoutComponent } from './cadastros-layout/cadastros-layout';
import { CadastrosHomeComponent } from './cadastros-home/cadastros-home';
import { OperadorasListComponent } from './operadoras-list/operadoras-list';
import { OperadorasFormComponent } from './operadoras-form/operadoras-form';

export const CADASTROS_ROUTES: Routes = [
  {
    path: '',
    component: CadastrosLayoutComponent,
    children: [
      { path: '', component: CadastrosHomeComponent, title: 'Cadastros' },
      { path: 'operadoras', component: OperadorasListComponent, title: 'Operadoras' },
      { path: 'operadoras/nova', component: OperadorasFormComponent, title: 'Nova Operadora' },
      { path: 'operadoras/editar/:id', component: OperadorasFormComponent, title: 'Editar Operadora' }
    ]
  }
];