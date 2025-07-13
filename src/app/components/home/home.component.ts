import { Component, ViewChild } from '@angular/core';
import { Produto } from '../../models/produto';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaCompras } from '../../models/lista-compras';
import { ListaComprasService } from '../../services/shopping-list/lista-compras-service';
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
import { AdicionaProdutoNaLista } from '../../models/interfaces/shoppingLists/add-produto-lista';
import { ItemLista } from '../../models/item-lista';
import { DialogModule } from 'primeng/dialog';
import { CriaListaCompras } from '../../models/interfaces/shoppingLists/cria-lista-compras';
import { ItemListaToAdd } from '../../models/interfaces/products/item-lista-to-add';

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
    SelectModule,
    DialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService]
})
export class HomeComponent {
  @ViewChild(Table, { read: Table }) pTable: Table | undefined;
  listasCompras!: ListaCompras[];
  products!: Produto[];
  clonedProducts: { [s: string]: Produto } = {};
  disableNewButton: boolean = false;
  unityOptions!: EnumDTO<number>[];
  dialogVisible: boolean = false;
  nomeLista: string = '';
  limiteListas: number = 0;

  constructor(
    private listaComprasService: ListaComprasService,
    private produtoService: ProductsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.loadListas();
  }

  loadListas(): void {
    this.listaComprasService.getAll().subscribe({
      next: (result) => {
        this.listasCompras = result;
        this.listasCompras.forEach(lista => {
          lista.itemLista.forEach(item => {
            let teste: EnumDTO<number> = {
              descricao: "string",
              nome: "string",
              valor: 1
            };
            item.unidade = this.unityOptions.find(opt => opt.valor === item.unidade?.valor) ?? teste;
          });
        });
        console.log(this.listasCompras)
        this.limiteListas = this.listasCompras.length;
      }
    });
  }

  loadEnums() {
    this.produtoService.getUnitys().subscribe({
      next: (result) => this.unityOptions = result
    })
  }

  editProduct(produto: Produto) {
    console.log(`O produto ${produto.nome} será editado aqui. Acho que pode ser edição inline`)
    return;
  }

  onDeleteRow(event: Event, produto: Produto) {
    console.log(`O produto ${produto.nome} será excluído aqui. Deve ter uma confirmação`)
    return;
  }

  marcaComoComprado(lista: ListaCompras, produto: Produto) {
    console.log("A situação do produto é alterada para Inativo")
    return;
  }

  addProduct(lista: ListaCompras) {
    return;
  }

  deleteList(lista: ListaCompras) {
    return;
  }

  onRowEditInit(product: Produto) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(lista: ListaCompras, produto: Produto) {
    if (produto.id) {
      //Edição aqui
    } else {
      const itemLista: ItemListaToAdd = {
        produtoId: '',
        nome: produto.nome,
        quantidade: produto.quantidade,
        unidade: produto.unidade.valor
      }

      const request: AdicionaProdutoNaLista = {
        listaComprasId: lista.id,
        itemLista: itemLista
      }

      this.listaComprasService.addProductToList(request).subscribe({
        next: (result) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Produto adicionado com sucesso.` });
          this.disableNewButton = false;
          this.loadListas();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Não foi possível adicionar o item.' });
        }
      });
    }
  }

  onRowEditCancel(product: Produto, index: number) {
    this.disableNewButton = false;
    this.loadListas();
  }

  onAddNewRow(lista: ListaCompras, table: Table) {
    this.disableNewButton = true;

    let addProduct = {} as ItemLista;

    lista.itemLista.unshift(addProduct);
    table.initRowEdit(addProduct);
  }

  onAddNewLista() {
    this.dialogVisible = true;
  }

  salvarNovaLista() {
    if (this.nomeLista) {
      const request: CriaListaCompras = {
        nome: this.nomeLista
      }

      this.listaComprasService.createList(request).subscribe({
        next: (result) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Nova lista cadastrada com sucesso.` });
          this.loadListas();
          this.nomeLista = '';
          this.dialogVisible = false;
        }
      })
    }
    this.dialogVisible = false;
  }
}
