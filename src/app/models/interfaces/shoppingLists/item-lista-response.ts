import { EnumDTO } from "../enum-dto";

export interface ItemListaResponse {
    id?: string;
    nome?: string;
    quantidade?: number;
    unidade?: EnumDTO<number>;
    situacao?: number;
}