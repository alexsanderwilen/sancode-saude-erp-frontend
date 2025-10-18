export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Número da página atual
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
