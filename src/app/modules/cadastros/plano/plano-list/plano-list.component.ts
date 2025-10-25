import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { PlanoService } from '../plano.service';
import { Plano } from '../plano.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-plano-list',
  templateUrl: './plano-list.component.html',
  styleUrls: ['./plano-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatIconModule, RouterModule, MatDialogModule, MatSnackBarModule]
})
export class PlanoListComponent {

  private gridApi!: GridApi<Plano>;
  public datasource!: IDatasource;
  public gridOptions: GridOptions<Plano>;

  public columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 100, sortable: true, filter: true },
    { headerName: 'Nome Comercial', field: 'nomeComercial', flex: 1, sortable: true, filter: true },
    { headerName: 'Registro ANS', field: 'registroAns', width: 160, sortable: true, filter: true },
    {
      headerName: 'Ativo', field: 'ativo', width: 120, cellRenderer: (p: { value: boolean }) => (
        p.value ? '<span class="badge text-bg-success">Ativo</span>' : '<span class="badge text-bg-danger">Inativo</span>'
      )
    },
    {
      headerName: 'Ações', width: 150, cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `
    }
  ];

  constructor(
    private planoService: PlanoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private agGridLocaleService: AgGridLocaleService
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

  onGridReady(params: GridReadyEvent<Plano>): void {
    this.gridApi = params.api;
  }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'nomeComercial';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';

        this.planoService.getPlanosPaged(page, pageSize, sort, order)
          .subscribe({
            next: data => params.successCallback(data.content, data.totalElements),
            error: err => {
              console.error('Erro ao buscar planos:', err);
              params.failCallback();
            }
          });
      }
    };
  }

  onActionClick(params: CellClickedEvent): void {
    const action = (params.event?.target as HTMLElement).dataset['action'];
    if (!action) return;
    if (action === 'edit') {
      this.router.navigate(['/cadastros/planos/editar', (params.data as any).id]);
    } else if (action === 'delete') {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar Exclusão',
          message: `Tem certeza que deseja excluir o plano ${(params.data as any).nomeComercial}?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.planoService.deletePlano((params.data as any).id).subscribe({
            next: () => {
              this.snackBar.open('Plano excluído com sucesso!', 'Fechar', { duration: 3000 });
              this.gridApi.refreshInfiniteCache();
            },
            error: (err) => {
              console.error('Erro ao excluir plano:', err);
              this.snackBar.open('Erro ao excluir plano. Detalhes: ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
            }
          });
        }
      });
    }
  }

  navigateToForm(): void {
    this.router.navigate(['/cadastros/planos/novo']);
  }
}
