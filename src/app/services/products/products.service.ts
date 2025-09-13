import { inject, Injectable } from '@angular/core';
import { Produto } from '../../models/produto';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnumDTO } from '../../models/interfaces/enum-dto';
import { ProdutoCreateRequest } from '../../models/interfaces/products/produto-create-request';
import { API_PATH } from '../../models/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<Produto[]>([]);
  public product$ = this.productsSubject.asObservable();

  controller = "produto";

  private httpClient = inject(HttpClient);

  getAll(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(`${API_PATH}/${this.controller}`);
  }

  getUnitys(): Observable<EnumDTO<number>[]> {
    return this.httpClient.get<EnumDTO<number>[]>(`${API_PATH}/${this.controller}/unidades`);
  }

  createProduto(params: ProdutoCreateRequest): Observable<Produto> {
    return this.httpClient.post<Produto>(`${API_PATH}/${this.controller}`, params);
  }
}
