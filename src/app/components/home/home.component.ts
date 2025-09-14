import { Component, ViewChild } from '@angular/core';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { EnumDTO } from '../../models/interfaces/enum-dto';
import { SelectModule } from 'primeng/select';
import { ProductsService } from '../../services/products/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdicionaProdutoNaLista } from '../../models/interfaces/shoppingLists/add-produto-lista';
import { DialogModule } from 'primeng/dialog';
import { CriaListaCompras } from '../../models/interfaces/shoppingLists/cria-lista-compras';
import { ItemListaToAdd } from '../../models/interfaces/products/item-lista-to-add';
import { ItemListaResponse } from '../../models/interfaces/shoppingLists/item-lista-response';
import { RemoveProdutoLista } from '../../models/interfaces/shoppingLists/remove-produto-lista';
import { ItemLista } from '../../models/item-lista';
import { AtualizaItemListaDto } from '../../models/interfaces/shoppingLists/atualiza-item-lista';

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
    DialogModule,
    ConfirmDialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent {
  @ViewChild(Table, { read: Table }) pTable: Table | undefined;
  listasCompras!: ListaCompras[];
  products!: ItemListaResponse[];
  clonedProducts: { [s: string]: ItemListaResponse } = {};
  disableNewButton: boolean = false;
  unityOptions!: EnumDTO<number>[];
  dialogVisible: boolean = false;
  nomeLista: string = '';
  limiteListas: number = 0;

  constructor(
    private listaComprasService: ListaComprasService,
    private produtoService: ProductsService,
    private confirmationService: ConfirmationService,
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
        this.limiteListas = this.listasCompras.length;
      }
    });
  }

  loadEnums() {
    this.produtoService.getUnitys().subscribe({
      next: (result) => this.unityOptions = result
    })
  }

  onDeleteRow(event: Event, produto: ItemLista, lista: ListaCompras) {
    const removeRequest: RemoveProdutoLista = {
      listaComprasId: lista.id,
      id: produto.id
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja remover o item ${produto.nome}`,
      header: 'Confirmar Delete:',
      icon: 'pi pi-info-circle',

      accept: () => {        
        this.listaComprasService.removeItemListaAsync(removeRequest).subscribe({
          next: (result) => {
            this.loadListas();           
          }
        });
                
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Item removido com sucesso!', life: 3000 }); 
      },
      reject: () => { this.loadListas(); }
    });
  }

  onRowEditInit(product: ItemListaResponse) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(lista: ListaCompras, produto: ItemListaResponse) {
    if (produto.id) {
      const request: AtualizaItemListaDto = {
        listaComprasId: lista.id,
        id: produto.id,
        nome: produto?.nome,
        quantidade: produto?.quantidade,
        unidade: produto.unidade?.valor,
        situacao: produto?.situacao,
      }

      this.listaComprasService.updateItemNaListaAsync(request).subscribe({
        next: (result) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Produto atualizado com sucesso.` });
          this.disableNewButton = false;
          this.loadListas();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Não foi possível atualizar o item.' });
        }
      })
    } else {
      const createRequest: ItemListaToAdd = {
        id: '',
        nome: produto.nome,
        quantidade: produto.quantidade,
        unidade: produto.unidade?.valor
      }

      const request: AdicionaProdutoNaLista = {
        listaComprasId: lista.id,
        itemLista: createRequest
      }

      this.listaComprasService.addItemListaAsync(request).subscribe({
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

  onRowEditCancel(sindex: number) {
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

  alteraSituacaoItem(lista: ListaCompras, produto: ItemListaResponse) {
    produto.situacao === 1 ? produto.situacao = 2 : produto.situacao = 1;

    if (produto.id) {
      const request: AtualizaItemListaDto = {
        listaComprasId: lista.id,
        id: produto.id,
        nome: produto?.nome,
        quantidade: produto?.quantidade,
        unidade: produto.unidade?.valor,
        situacao: produto?.situacao,
      }

      this.listaComprasService.updateItemNaListaAsync(request).subscribe({
        next: (result) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Produto atualizado com sucesso.` });
          this.disableNewButton = false;
          this.loadListas();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Não foi possível atualizar o item.' });
        }
      })
    }
  }

  deletarLista(event: Event ,lista: ListaCompras): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja remover a lista ${lista.nome}`,
      header: 'Confirmar Delete:',
      icon: 'pi pi-info-circle',

      accept: () => {        
        this.listaComprasService.deleteLista(lista.id).subscribe({
          next: (result) => {
            this.loadListas();           
          }
        });
                
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Lista deletada com sucesso com sucesso.`, life: 3000 })
      },
      reject: () => { this.loadListas(); }
    });
  }
}
