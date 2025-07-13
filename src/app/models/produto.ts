import { EnumDTO } from "./interfaces/enum-dto";

export interface Produto {
  id: string,
  nome: string,
  quantidade: number,
  unidade: EnumDTO<number>,
  situacao: EnumDTO<number>
}
