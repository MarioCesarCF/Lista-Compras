import { Produto } from "./produto";

export interface ShoppingList {
    id: string;
    title: string;
    products: Produto[];
}