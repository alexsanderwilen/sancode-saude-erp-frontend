export interface Usuario {
  id: number;
  codigo?: string;
  nomeCompleto: string;
  nomeSocial?: string;
  apelido?: string;
  username: string;
  email: string;
  telefone?: string;
  celular?: string;
  ultimoLogin?: Date;
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | 'PENDENTE';
  precisaTrocarSenha?: boolean;
  autenticacaoDupla?: boolean;
  cpf?: string;
  rg?: string;
  orgaoEmissor?: string;
  dataNascimento?: Date;
  sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  estadoCivil?: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'OUTRO';
  nacionalidade?: string;
  naturalidade?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
  roles: any[]; // Ajustar para uma interface Role se necessário
}
