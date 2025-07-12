import { Component, ViewChild } from '@angular/core';
import { Produto } from '../../models/produto';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../../models/shopping-list';
import { ShoppingListService } from '../../services/shopping-list/shopping-list.service';
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    RippleModule,
    ToastModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService]
})
export class HomeComponent {
  @ViewChild(Table, {read: Table}) pTable: Table | undefined;
  listasCompras!: ShoppingList[];
  products!: Produto[];
  clonedProducts: { [s: string]: Produto } = {};
  disableNewButton: boolean = false;

  constructor(
    private shoppingListService: ShoppingListService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadListas();    
  }

  loadListas(): void {
    this.shoppingListService.getAll().subscribe({
      next: (result) => this.listasCompras = result
    });
  }

  editProduct(produto: Produto) {
    console.log(`O produto ${produto.name} será editado aqui. Acho que pode ser edição inline`)
    return;
  }

  onDeleteRow(event: Event, produto: Produto) {
    console.log(`O produto ${produto.name} será excluído aqui. Deve ter uma confirmação`)
    return;
  }

  marcaComoComprado(lista: ShoppingList, produto: Produto) {
    console.log("A situação do produto é alterada para Inativo")
    return;
  }

  addProduct(lista: ShoppingList) {
    return;
  }

  deleteList(lista: ShoppingList) {
    return;
  }

  onRowEditInit(product: Produto) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Produto) {
    if (product.amount > 0) {
      delete this.clonedProducts[product.id as string];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
    this.disableNewButton = false;
    this.loadListas();
  }

  onRowEditCancel(product: Produto, index: number) {
    this.disableNewButton = false;
    this.loadListas();
  }

  onAddNewRow(lista: ShoppingList, table: Table) {
    this.disableNewButton = true;

    let addProduct = {} as Produto;

    lista.products.unshift(addProduct);
    table.initRowEdit(addProduct);
  }
}
