export interface BeneficiarioEndereco {
  id?: string;
  tipo: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  latitude?: number;
  longitude?: number;
}

export interface BeneficiarioTelefone {
  id?: string;
  tipo: string;
  ddd: string;
  numero: string;
  ramal?: string;
  whatsapp: boolean;
}

export interface BeneficiarioEmail {
  id?: string;
  tipo: string;
  email: string;
}

export interface Beneficiario {
  idBeneficiario?: string;
  idSexo: number;
  idEstadoCivil: number;
  nomeCompleto: string;
  nomeSocial?: string;
  cpf: string;
  cns?: string;
  rg?: string;
  orgaoEmissor?: string;
  dataNascimento: string;
  ativo: boolean;
  enderecos: BeneficiarioEndereco[];
  telefones: BeneficiarioTelefone[];
  emails: BeneficiarioEmail[];
}

export interface Page<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Sexo {
  idSexo: number;
  descricao: string;
  ativo: boolean;
}

export interface EstadoCivil {
  idEstadoCivil: number;
  descricao: string;
  ativo: boolean;
}

export interface Parentesco {
  idParentesco: number;
  descricao: string;
  ativo: boolean;
}

export interface Situacao {
  idSituacao: number;
  descricao: string;
  ativo: boolean;
}

export interface BeneficiarioPlano {
  id?: number;
  idBeneficiario: string;
  idTitular?: string | null;
  idPlano: number;
  idSituacao: number;
  idParentesco: number;
  numeroCarteirinha: string;
  tipoVinculo: 'TITULAR' | 'DEPENDENTE';
  dataAdesao: string;
  dataInicioVigencia: string;
  dataFimVigencia?: string | null;
  emCarencia: boolean;
  dataFimCarencia?: string | null;
  valorMensalidade?: number | null;
  possuiCoparticipacao: boolean;
  percentualCoparticipacao?: number | null;
  possuiDoencaPreexistente: boolean;
  descricaoDoencasPreexistentes?: string | null;
  matriculaFuncionario?: string | null;
  cargo?: string | null;
  departamento?: string | null;
  dataAdmissao?: string | null;
  ativo: boolean;
}
