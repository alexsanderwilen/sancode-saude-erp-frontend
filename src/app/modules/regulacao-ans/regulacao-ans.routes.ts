import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExecucoesListComponent } from './validacoes/execucoes-list/execucoes-list.component';
import { ResultadosGridComponent } from './validacoes/resultados-list/resultados-grid.component';
import { RegrasListComponent } from './validacoes/regras-list/regras-list.component';
import { ExportacoesComponent } from './exportacoes/exportacoes.component';
import { TissPageComponent } from './tiss/tiss-page.component';
import { RegulacaoAnsHomeComponent } from './regulacao-ans.home';

export const REGULACAO_ANS_ROUTES: Routes = [
  { path: '', component: RegulacaoAnsHomeComponent, title: 'Regulação ANS' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard ANS' },
  { path: 'validacoes/execucoes', component: ExecucoesListComponent, title: 'Execuções de Validação' },
  { path: 'validacoes/resultados', component: ResultadosGridComponent, title: 'Resultados de Validação' },
  { path: 'validacoes/regras', component: RegrasListComponent, title: 'Regras ANS' },
  { path: 'exportacoes', component: ExportacoesComponent, title: 'Exportações ANS' },
  { path: 'tiss', component: TissPageComponent, title: 'TISS' }
];
