export interface Usuario {
  id: number;
  nomeCompleto: string; // Mapeado de nomeCompleto
  username: string;
  email: string;
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | 'PENDENTE';
  // Adicione outros campos conforme necessário
}

