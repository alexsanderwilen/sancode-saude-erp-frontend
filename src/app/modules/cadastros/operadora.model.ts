export interface OperadoraEndereco {
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

export interface OperadoraTelefone {
  id?: string;
  tipo: string;
  ddd: string;
  numero: string;
  ramal?: string;
  whatsapp: boolean;
}

export interface OperadoraEmail {
  id?: string;
  tipo: string;
  email: string;
}

export interface Operadora {
  idOperadora?: string;
  registroAns: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  dataRegistroAns: string; // Using string for simplicity, can be Date
  ativo: boolean;
  enderecos: OperadoraEndereco[];
  telefones: OperadoraTelefone[];
  emails: OperadoraEmail[];
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

