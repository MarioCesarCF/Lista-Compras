import { Produto } from "../../produto";

export interface AddProductToList {
    shoppingListId: string;
    product: Produto;
}