import { ItemListaResponse } from "./interfaces/shoppingLists/item-lista-response";
import { ItemLista } from "./item-lista";

export interface ListaCompras {
    id: string;
    nome: string;
    itemLista: ItemLista[];
}