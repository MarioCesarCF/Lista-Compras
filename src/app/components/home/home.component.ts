import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../../models/produto';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
