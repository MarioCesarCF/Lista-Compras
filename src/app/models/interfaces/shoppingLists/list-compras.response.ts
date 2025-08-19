import { ItemLista } from "../../item-lista";


export interface ListaComprasResponse {
    id: string;
    nome: string;
    itemLista: ItemLista[];
}