export interface Operadora {
  idOperadora?: string;
  registroAns: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  dataRegistroAns: string; // Using string for simplicity, can be Date
  emailCorporativo: string;
  telefonePrincipal: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  ativo: boolean;
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
