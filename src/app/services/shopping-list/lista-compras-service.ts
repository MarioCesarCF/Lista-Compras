import { inject, Injectable } from '@angular/core';
import { ListaCompras } from '../../models/lista-compras';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListaComprasUpdateRequest } from '../../models/interfaces/shoppingLists/lista-compras-update-request';
import { AdicionaProdutoNaLista } from '../../models/interfaces/shoppingLists/add-produto-lista';
import { CriaListaCompras } from '../../models/interfaces/shoppingLists/cria-lista-compras';

@Injectable({
  providedIn: 'root'
})
export class ListaComprasService {
  private listaComprasSubject = new BehaviorSubject<ListaCompras[]>([]);
  public listaCompras$ = this.listaComprasSubject.asObservable();

  API_PATH = "https://localhost:7050/api";
  controller = "listacompras";

  private httpClient = inject(HttpClient);

  getAll(): Observable<ListaCompras[]> {
    return this.httpClient.get<ListaCompras[]>(`${this.API_PATH}/${this.controller}`);
  }

  createList(params: CriaListaCompras): Observable<ListaCompras> {
    return this.httpClient.post<ListaCompras>(`${this.API_PATH}/${this.controller}`, params)
  }

  updateList(params: ListaComprasUpdateRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.API_PATH}/${this.controller}`, params)
  }

  addProductToList(request: AdicionaProdutoNaLista): Observable<void>{
    return this.httpClient.post<void>(`${this.API_PATH}/${this.controller}/add-item`, request)
  }
}
