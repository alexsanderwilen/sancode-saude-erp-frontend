export interface OperadoraRef {
  idOperadora: string;
  razaoSocial?: string;
  nomeFantasia?: string;
}

export interface PlanoBase {
  id: number;
  operadora?: OperadoraRef;
  ativo: boolean;
  descricao?: string; // computed label for UI
}
