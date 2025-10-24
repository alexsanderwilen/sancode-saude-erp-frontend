export interface Plano {
  id?: number;
  idPlanoBase: number;
  idSegmentacao: number;
  idAbrangencia: number;
  idTipoContratacao: number;
  idPlanoStatus: number;
  nomeComercial: string;
  registroAns?: string;
  possuiCoparticipacao: boolean;
  percentualCoparticipacao?: number;
  franquiaValor?: number;
  valorMensalidade?: number;
  dataInicioVigencia: string; // ou Date
  dataFimVigencia?: string; // ou Date
  ativo: boolean;

  // Seleções N:N
  tiposPagamentoIds?: number[];
  acomodacoesIds?: number[];
  coberturasAdicionaisIds?: number[];
}
