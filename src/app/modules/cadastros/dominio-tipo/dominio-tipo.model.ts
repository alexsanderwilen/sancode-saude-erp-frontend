export interface DominioTipo {
  id: number;
  tipoDoTipo: 'ENDERECO' | 'EMAIL' | 'TELEFONE';
  descricao: string;
  ativo: boolean;
}
