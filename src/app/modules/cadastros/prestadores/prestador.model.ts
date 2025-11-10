export interface Prestador {
  id?: number;
  tipoPessoa: 'F' | 'J';
  cpfCnpj: string;
  nomeRazaoSocial: string;
  nomeFantasia?: string;
  cnes?: string;
  registroConselho?: string;
  tipoConselho?: string;
  ufConselho?: string;
  especialidadePrincipal?: string;
  especialidadesSecundarias?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  site?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  pais?: string;
  latitude?: number;
  longitude?: number;
  tipoPrestador: string;
  atendeUrgencia?: boolean;
  atendeDomiciliar?: boolean;
  situacaoCadastral: 'Ativo' | 'Inativo' | 'Suspenso';
  dataCadastro?: string;
  dataAtualizacao?: string;
  observacoes?: string;
  idOperadora: string;
}

