import { inject, Injectable } from '@angular/core';
import { ShoppingList } from '../../models/shopping-list';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private shoppingListsSubject = new BehaviorSubject<ShoppingList[]>([]);
  public shoppingList$ = this.shoppingListsSubject.asObservable();

  API_PATH = "https://localhost:7050/api";

  private httpClient = inject(HttpClient);

  getAll(): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${this.API_PATH}/shoppinglist`);
  }
}
