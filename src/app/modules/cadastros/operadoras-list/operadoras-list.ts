import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, IDatasource, GridReadyEvent, CellClickedEvent, IGetRowsParams } from 'ag-grid-community';
import { OperadoraService } from '../operadora.service';
import { Operadora } from '../operadora.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-operadoras-list',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './operadoras-list.html',
  styleUrl: './operadoras-list.scss'
})
export class OperadorasListComponent {

  private gridApi!: GridApi<Operadora>;
  public datasource!: IDatasource;
  public gridOptions: GridOptions<Operadora>;

  public columnDefs: ColDef[] = [
    { headerName: 'Registro ANS', field: 'registroAns', sortable: true, filter: true },
    { headerName: 'CNPJ', field: 'cnpj', sortable: true, filter: true },
    { headerName: 'Razão Social', field: 'razaoSocial', flex: 1, sortable: true, filter: true },
    { headerName: 'Nome Fantasia', field: 'nomeFantasia', flex: 1, sortable: true, filter: true },
    {
      headerName: 'Status', field: 'ativo', width: 120, cellRenderer: (params: { value: boolean; }) => {
        return params.value ? '<span class="badge text-bg-success">Ativo</span>' : '<span class="badge text-bg-danger">Inativo</span>';
      }
    },
    {
      headerName: 'Ações',
      width: 150,
      cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `
    }
  ];

  constructor(
    private operadoraService: OperadoraService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private agGridLocaleService: AgGridLocaleService
  ) {
    this.datasource = this.createDatasource();
    this.gridOptions = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      theme: 'legacy',
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 20,
      cacheBlockSize: 20,
      onCellClicked: (params: CellClickedEvent) => this.onActionClick(params)
    };
  }

  onGridReady(params: GridReadyEvent<Operadora>): void {
    this.gridApi = params.api;
  }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const page = params.startRow / this.gridOptions.paginationPageSize!;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'razaoSocial';
        const order = sortModel.length ? sortModel[0].sort : 'asc';

        this.operadoraService.getOperadoras(page, this.gridOptions.paginationPageSize!, sort, order)
          .subscribe(data => {
            params.successCallback(
              data.content,
              data.totalElements
            );
          });
      },
    };
  }

  onActionClick(params: CellClickedEvent): void {
    const action = (params.event?.target as HTMLElement).dataset['action'];
    if (action === 'edit') {
      this.router.navigate(['/cadastros/operadoras/editar', params.data.idOperadora]);
    } else if (action === 'delete') {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar Exclusão',
          message: `Tem certeza que deseja excluir a operadora ${params.data.razaoSocial}?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.operadoraService.delete(params.data.idOperadora!).subscribe({
            next: () => {
              this.snackBar.open('Operadora excluída com sucesso!', 'Fechar', { duration: 3000 });
              this.gridApi.refreshInfiniteCache(); // Atualiza a grid
            },
            error: (err) => {
              console.error('Erro ao excluir operadora:', err);
              this.snackBar.open('Erro ao excluir operadora. Detalhes: ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
            }
          });
        }
      });
    }
  }

  navigateToForm(): void {
    this.router.navigate(['/cadastros/operadoras/nova']);
  }
}


