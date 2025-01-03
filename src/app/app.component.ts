import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Produto } from './models/produto';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Lista-Compras';
  http = inject(HttpClient);
  url = "https://localhost:7050/api";
  listaCompras$?: Observable<Produto[]>

  produtoEncontrado$?: Observable<Produto>;
  valorBuscarProduto: string = '';

  ngOnInit(): void {
    this.obterListaCompras();
  }

  obterListaCompras() {
    this.listaCompras$ = this.http.get<Produto[]>(`${this.url}/product`);
  }

  obterProduto() {
    this.produtoEncontrado$ = this.http.get<Produto>(`${this.url}/product/${this.valorBuscarProduto}`);
  }
}
