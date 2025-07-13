import { ItemListaToAdd } from "../products/item-lista-to-add";

export interface AdicionaProdutoNaLista {
    listaComprasId: string;
    itemLista: ItemListaToAdd;
}