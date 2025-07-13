import { EnumDTO } from "./interfaces/enum-dto";

export interface ItemLista {
    produtoId?: string;
    nome?: string;
    quantidade: number;
    unidade: EnumDTO<number>;
    situacao?: number;
}