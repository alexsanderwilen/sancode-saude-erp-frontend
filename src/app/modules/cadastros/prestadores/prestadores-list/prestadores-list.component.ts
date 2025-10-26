import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { PrestadorService } from '../prestador.service';
import { Prestador } from '../prestador.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-prestadores-list',
  templateUrl: './prestadores-list.component.html',
  styleUrls: ['./prestadores-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatIconModule, RouterModule, MatDialogModule, MatSnackBarModule]
})
export class PrestadoresListComponent implements OnInit {
  private gridApi!: GridApi<Prestador>;
  public datasource!: IDatasource;
  public gridOptions: GridOptions<Prestador>;

  public columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 110, sortable: true, filter: true },
    { headerName: 'Nome / Razão Social', field: 'nomeRazaoSocial', flex: 1, sortable: true, filter: true },
    { headerName: 'CPF / CNPJ', field: 'cpfCnpj', width: 160, sortable: true, filter: true },
    { headerName: 'Cidade', field: 'cidade', flex: 1, sortable: true, filter: true },
    { headerName: 'UF', field: 'uf', width: 90, sortable: true, filter: true },
    { headerName: 'Situação', field: 'situacaoCadastral', width: 140, sortable: true, filter: true },
    {
      headerName: 'Ações', width: 160, sortable: false, filter: false,
      cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `
    }
  ];

  constructor(
    private prestadorService: PrestadorService,
    private agGridLocaleService: AgGridLocaleService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.datasource = this.createDatasource();
    this.gridOptions = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 20,
      cacheBlockSize: 20,
      onCellClicked: (params: CellClickedEvent) => this.onActionClick(params)
    };
  }

  ngOnInit(): void {}

  onGridReady(params: GridReadyEvent<Prestador>): void {
    this.gridApi = params.api;
  }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'nomeRazaoSocial';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';

        this.prestadorService.getPrestadoresPaged(page, pageSize, sort, order)
          .subscribe({
            next: data => params.successCallback(data.content, data.totalElements),
            error: err => params.failCallback()
          });
      },
    };
  }

  onActionClick(params: CellClickedEvent): void {
    const action = (params.event?.target as HTMLElement).getAttribute('data-action');
    if (!action) return;
    if (action === 'edit') {
      this.router.navigate(['/cadastros/prestadores/editar', (params.data as any).id]);
    } else if (action === 'delete') {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar Exclusão',
          message: `Deseja excluir o prestador ${(params.data as any).nomeRazaoSocial}?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.prestadorService.deletePrestador((params.data as any).id).subscribe({
            next: () => {
              this.snackBar.open('Prestador excluído com sucesso!', 'Fechar', { duration: 3000 });
              this.gridApi.refreshInfiniteCache();
            },
            error: () => this.snackBar.open('Erro ao excluir prestador.', 'Fechar', { duration: 3000 })
          });
        }
      });
    }
  }
}

