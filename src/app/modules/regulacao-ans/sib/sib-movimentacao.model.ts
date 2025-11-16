export interface SibMovimentacao {
  beneficiarioId: string;
  nomeBeneficiario: string;
  cpf: string;
  tipoMovimentacao: 'INCLUSAO' | 'ALTERACAO' | 'CANCELAMENTO' | 'REATIVACAO';
  dataMovimentacao: string; // ISO date string
  detalhes: string;
}
