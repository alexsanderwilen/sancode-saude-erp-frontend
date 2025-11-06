export interface ValidationResult {
  regraCodigo: string;
  titulo: string;
  severidade: string;
  entidade: 'BENEFICIARIO' | 'PLANO' | string;
  entidadeId?: string | number;
  mensagem: string;
  criadoEm?: string;
}

export interface ValidationExecution {
  id: number;
  status?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface ValidationRule {
  code: string;
  title: string;
  description?: string;
  severity?: string;
}

