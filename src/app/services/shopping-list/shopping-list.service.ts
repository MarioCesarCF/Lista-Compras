import { inject, Injectable } from '@angular/core';
import { ShoppingList } from '../../models/shopping-list';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingListUpdateRequest } from '../../models/interfaces/shoppingLists/shopping-list-update-request';
import { AddProductToList } from '../../models/interfaces/shoppingLists/add-product-list';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private shoppingListsSubject = new BehaviorSubject<ShoppingList[]>([]);
  public shoppingList$ = this.shoppingListsSubject.asObservable();

  API_PATH = "https://localhost:7050/api";
  controller = "shoppinglist";

  private httpClient = inject(HttpClient);

  getAll(): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${this.API_PATH}/${this.controller}`);
  }

  updateList(params: ShoppingListUpdateRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.API_PATH}/${this.controller}`, params)
  }

  addProductToList(request: AddProductToList): Observable<void>{
    return this.httpClient.post<void>(`${this.API_PATH}/${this.controller}/add-product`, request)
  }
}
