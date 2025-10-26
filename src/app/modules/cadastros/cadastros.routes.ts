import { Routes } from '@angular/router';
import { CadastrosLayoutComponent } from './cadastros-layout/cadastros-layout';
import { CadastrosHomeComponent } from './cadastros-home/cadastros-home';
import { OperadorasListComponent } from './operadoras-list/operadoras-list';
import { OperadorasFormComponent } from './operadoras-form/operadoras-form';
import { DominioTipoListComponent } from './dominio-tipo/dominio-tipo-list/dominio-tipo-list';

export const CADASTROS_ROUTES: Routes = [
  {
    path: '',
    component: CadastrosLayoutComponent,
    children: [
      { path: '', component: CadastrosHomeComponent, title: 'Cadastros' },
      { path: 'operadoras', component: OperadorasListComponent, title: 'Operadoras' },
      { path: 'operadoras/nova', component: OperadorasFormComponent, title: 'Nova Operadora' },
      { path: 'operadoras/editar/:id', component: OperadorasFormComponent, title: 'Editar Operadora' },
      { path: 'dominio-tipos', component: DominioTipoListComponent, title: 'Tipos de Domínio' },
      {
        path: 'prestadores',
        loadChildren: () => import('./prestadores/prestadores.routes').then(m => m.PRESTADORES_ROUTES),
        title: 'Prestadores'
      },
      {
        path: 'planos',
        loadChildren: () => import('./plano/plano.routes').then(m => m.PLANO_ROUTES),
        title: 'Planos'
      }
      ,
      {
        path: 'gestao-planos',
        loadChildren: () => import('./gestao-planos/gestao-planos.routes').then(m => m.GESTAO_PLANOS_ROUTES),
        title: 'Gestão de Planos'
      }
    ]
  }
];

