import { Routes } from '@angular/router';
import { GestaoPlanosHomeComponent } from './gestao-planos.home';
import { PlanoBaseListComponent } from '../plano-base/plano-base-list.component';
import { SegmentacaoAssistencialListComponent } from '../segmentacao-assistencial/segmentacao-assistencial-list.component';
import { AbrangenciaGeograficaListComponent } from '../abrangencia-geografica/abrangencia-geografica-list.component';
import { TipoContratacaoListComponent } from '../tipo-contratacao/tipo-contratacao-list.component';
import { PlanoStatusListComponent } from '../plano-status/plano-status-list.component';
import { TipoPagamentoListComponent } from '../tipo-pagamento/tipo-pagamento-list.component';
import { AcomodacaoListComponent } from '../acomodacao/acomodacao-list.component';
import { CoberturaAdicionalListComponent } from '../cobertura-adicional/cobertura-adicional-list/cobertura-adicional-list.component';

export const GESTAO_PLANOS_ROUTES: Routes = [
  { path: '', component: GestaoPlanosHomeComponent, title: 'Gestão de Planos' },
  { path: 'planos-base', component: PlanoBaseListComponent, title: 'Planos Base' },
  { path: 'segmentacoes', component: SegmentacaoAssistencialListComponent, title: 'Segmentações Assistenciais' },
  { path: 'abrangencias', component: AbrangenciaGeograficaListComponent, title: 'Abrangências Geográficas' },
  { path: 'tipos-contratacao', component: TipoContratacaoListComponent, title: 'Tipos de Contratação' },
  { path: 'planos-status', component: PlanoStatusListComponent, title: 'Status de Plano' },
  { path: 'tipos-pagamento', component: TipoPagamentoListComponent, title: 'Tipos de Pagamento' },
  { path: 'acomodacoes', component: AcomodacaoListComponent, title: 'Acomodações' },
  { path: 'coberturas-adicionais', component: CoberturaAdicionalListComponent, title: 'Coberturas Adicionais' }
];


