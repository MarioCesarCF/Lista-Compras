import { inject, Injectable } from '@angular/core';
import { Produto } from '../../models/produto';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnumDTO } from '../../models/interfaces/enum-dto';
import { ProdutoCreateRequest } from '../../models/interfaces/products/produto-create-request';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<Produto[]>([]);
  public product$ = this.productsSubject.asObservable();

  API_PATH = "https://localhost:7050/api";
  controller = "product";

  private httpClient = inject(HttpClient);

  getAll(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(`${this.API_PATH}/${this.controller}`);
  }

  getUnitys(): Observable<EnumDTO<number>[]> {
    return this.httpClient.get<EnumDTO<number>[]>(`${this.API_PATH}/${this.controller}/unidades`);
  }

  createProduto(params: ProdutoCreateRequest): Observable<Produto> {
    return this.httpClient.post<Produto>(`${this.API_PATH}/${this.controller}`, params);
  }
}
