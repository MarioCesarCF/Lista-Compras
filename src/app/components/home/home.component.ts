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
import { EnumDTO } from '../../models/interfaces/enum-dto';
import { SelectModule } from 'primeng/select';
import { ProductsService } from '../../services/products/products.service';
import { ProdutoCreateRequest } from '../../models/interfaces/products/produto-create-request';
import { HttpErrorResponse } from '@angular/common/http';
import { AddProductToList } from '../../models/interfaces/shoppingLists/add-product-list';

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
    ToastModule,
    SelectModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService]
})
export class HomeComponent {
  @ViewChild(Table, { read: Table }) pTable: Table | undefined;
  listasCompras!: ShoppingList[];
  products!: Produto[];
  clonedProducts: { [s: string]: Produto } = {};
  disableNewButton: boolean = false;
  unityOptions: EnumDTO<number>[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private produtoService: ProductsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadListas();
    this.loadEnums();
  }

  loadListas(): void {
    this.shoppingListService.getAll().subscribe({
      next: (result) => this.listasCompras = result
    });
  }

  loadEnums() {
    this.produtoService.getUnitys().subscribe({
      next: (result) => this.unityOptions = result
    })
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

  onRowEditSave(lista: ShoppingList, product: Produto) {
    if (product.id) {
      //Edição aqui
    } else {
      var novoProduto: ProdutoCreateRequest = {
        name: product.name,
        amount: product.amount,
        unity: product.unity.valor
      }

      var produtoCadatrado!: Produto;

      this.produtoService.createProduto(novoProduto).subscribe({
        next: (result) => {
          produtoCadatrado = result;
          const request: AddProductToList = {
            shoppingListId: lista.id,
            product: produtoCadatrado
          }

          this.shoppingListService.addProductToList(request).subscribe({
            next: (result) => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: `Produto ${produtoCadatrado.name} cadastrado com sucesso.` });
              this.disableNewButton = false;
              this.loadListas();
            },
            error: (err: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
            }
          });
        }
      });
    }
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
