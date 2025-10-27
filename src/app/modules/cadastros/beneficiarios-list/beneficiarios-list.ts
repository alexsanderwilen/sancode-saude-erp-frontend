import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BeneficiarioService } from '../beneficiario.service';
import { Beneficiario } from '../beneficiario.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-beneficiarios-list',
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
  templateUrl: './beneficiarios-list.html',
  styleUrl: './beneficiarios-list.scss'
})
export class BeneficiariosListComponent {
  private gridApi!: GridApi<Beneficiario>;
  public datasource!: IDatasource;
  public gridOptions: GridOptions<Beneficiario>;

  public columnDefs: ColDef[] = [
    { headerName: 'Nome', field: 'nomeCompleto', flex: 1, sortable: true, filter: true },
    { headerName: 'CPF', field: 'cpf', sortable: true, filter: true },
    { headerName: 'Nascimento', field: 'dataNascimento', sortable: true, filter: true },
    { headerName: 'Ativo', field: 'ativo', width: 120, cellRenderer: (params: { value: boolean }) => params.value ? '<span class="badge text-bg-success">Ativo</span>' : '<span class="badge text-bg-danger">Inativo</span>' },
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
    private beneficiarioService: BeneficiarioService,
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

  onGridReady(params: GridReadyEvent<Beneficiario>): void {
    this.gridApi = params.api;
  }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const page = params.startRow / this.gridOptions.paginationPageSize!;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'nomeCompleto';
        const order = sortModel.length ? sortModel[0].sort : 'asc';
        this.beneficiarioService.getBeneficiarios(page, this.gridOptions.paginationPageSize!, sort, order)
          .subscribe(data => {
            params.successCallback(data.content, data.totalElements);
          });
      },
    };
  }

  onActionClick(params: CellClickedEvent): void {
    const action = (params.event?.target as HTMLElement).dataset['action'];
    if (action === 'edit') {
      this.router.navigate(['/cadastros/beneficiarios/editar', (params.data as Beneficiario).idBeneficiario]);
    } else if (action === 'delete') {
      this.dialog.open(ConfirmDialogComponent, {
        data: { title: 'Confirmar Exclusão', message: `Deseja excluir o beneficiário ${(params.data as Beneficiario).nomeCompleto}?` }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.beneficiarioService.delete((params.data as Beneficiario).idBeneficiario!).subscribe({
            next: () => {
              this.snackBar.open('Beneficiário excluído!', 'Fechar', { duration: 3000 });
              this.gridApi.refreshInfiniteCache();
            },
            error: (err) => {
              console.error('Erro ao excluir beneficiário:', err);
              this.snackBar.open('Erro ao excluir beneficiário. ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
            }
          });
        }
      });
    }
  }

  navigateToForm(): void {
    this.router.navigate(['/cadastros/beneficiarios/nova']);
  }
}
