import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DominioTipo } from '../dominio-tipo.model';
import { DominioTipoService } from '../dominio-tipo.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DominioTipoFormComponent } from '../dominio-tipo-form/dominio-tipo-form';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

import { AgGridModule } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { StatusChipRenderer } from './status-chip-renderer.component';

@Component({
  selector: 'app-dominio-tipo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    AgGridModule,
    MatIconModule,
  ],
  templateUrl: './dominio-tipo-list.html',
  styleUrl: './dominio-tipo-list.scss',
})
export class DominioTipoListComponent implements OnInit, OnDestroy {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private refreshSubscription!: Subscription;

  gridOptions: GridOptions;
  datasource!: IDatasource;
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true, width: 90 },
    { field: 'tipoDoTipo', headerName: 'Tipo', sortable: true, filter: true, flex: 1 },
    { field: 'descricao', headerName: 'Descrição', sortable: true, filter: true, flex: 2 },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: StatusChipRenderer,
    },
    {
      headerName: 'Ações',
      width: 160,
      sortable: false,
      filter: false,
      cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary me-1">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
    },
  ];

  private gridApi!: GridApi;

  constructor(private dominioTipoService: DominioTipoService, private agGridLocaleService: AgGridLocaleService) {
    this.datasource = this.createDatasource();
    this.gridOptions = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      theme: 'legacy',
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 20,
      cacheBlockSize: 20,
      onCellClicked: (params: CellClickedEvent) => this.onActionClick(params),
    };
  }

  ngOnInit(): void {
    this.refreshSubscription = this.dominioTipoService.refreshNeeded$.subscribe(() => {
      if (this.gridApi) {
        this.gridApi.refreshInfiniteCache();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'descricao';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';

        this.dominioTipoService.findPaged(page, pageSize, sort, order).subscribe({
          next: data => params.successCallback(data.content, data.totalElements),
          error: err => {
            console.error('Erro ao buscar tipos de domínio:', err);
            params.failCallback();
          }
        });
      }
    };
  }

  onActionClick(params: CellClickedEvent): void {
    const action = (params.event?.target as HTMLElement).getAttribute('data-action');
    if (!action) return;
    if (action === 'edit') {
      this.openDialog(params.data as DominioTipo);
    } else if (action === 'delete') {
      const id = (params.data as DominioTipo).id;
      if (!id) return;
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Tem certeza que deseja excluir este tipo de domínio?' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dominioTipoService.delete(id).subscribe({
            next: () => {
              this.snackBar.open('Tipo de domínio excluído com sucesso!', 'Fechar', { duration: 3000 });
              // O refresh agora é acionado pelo Subject no serviço
            },
            error: (error) => {
              console.error('Erro ao excluir tipo de domínio:', error);
              this.snackBar.open('Erro ao excluir tipo de domínio.', 'Fechar', { duration: 3000 });
            },
          });
        }
      });
    }
  }

  openDialog(data?: DominioTipo): void {
    const dialogRef = this.dialog.open(DominioTipoFormComponent, {
      width: '700px',
      panelClass: 'sancode-cadastro-theme',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isEdit = !!data;
        const request = isEdit
          ? this.dominioTipoService.update(data!.id, result)
          : this.dominioTipoService.create(result);

        const successMessage = isEdit
          ? 'Tipo de domínio atualizado com sucesso!'
          : 'Tipo de domínio criado com sucesso!';

        request.subscribe({
          next: () => {
            this.snackBar.open(successMessage, 'Fechar', { duration: 3000 });
            // O refresh agora é acionado pelo Subject no serviço
          },
          error: (error) => {
            console.error('Erro ao salvar tipo de domínio:', error);
            this.snackBar.open('Erro ao salvar tipo de domínio.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteDominioTipo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja excluir este tipo de domínio?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dominioTipoService.delete(id).subscribe({
          next: () => {
            this.snackBar.open('Tipo de domínio excluído com sucesso!', 'Fechar', { duration: 3000 });
            // O refresh agora é acionado pelo Subject no serviço
          },
          error: (error) => {
            console.error('Erro ao excluir tipo de domínio:', error);
            this.snackBar.open('Erro ao excluir tipo de domínio.', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }
}




