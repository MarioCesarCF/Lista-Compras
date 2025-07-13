export interface EnumDTO<T> {
  id?: string;
  descricao: string;
  nome: string;
  valor: T;
}