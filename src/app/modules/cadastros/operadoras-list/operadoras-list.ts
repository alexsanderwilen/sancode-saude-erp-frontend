import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, IDatasource, GridReadyEvent, CellClickedEvent, IGetRowsParams } from 'ag-grid-community';
import { OperadoraService } from '../operadora.service';
import { Operadora } from '../operadora.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-operadoras-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './operadoras-list.html',
  styleUrl: './operadoras-list.scss'
})
export class OperadorasListComponent {

  private readonly operadoraService = inject(OperadoraService);
  private readonly router = inject(Router);

  private gridApi!: GridApi<Operadora>;
  public datasource!: IDatasource;

  constructor() {
    this.datasource = this.createDatasource();
  }

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
      width: 120,
      cellRenderer: () => `
        <button title="Editar" data-action="edit" class="btn btn-sm btn-outline-primary"><i class="fa fa-pencil" data-action="edit"></i></button>
        <button title="Excluir" data-action="delete" class="btn btn-sm btn-outline-danger"><i class="fa fa-trash" data-action="delete"></i></button>
      `
    }
  ];

  public gridOptions: GridOptions<Operadora> = {
    rowModelType: 'infinite',
    pagination: true,
    paginationPageSize: 20,
    cacheBlockSize: 20,
    onCellClicked: (params: CellClickedEvent) => this.onActionClick(params)
  };

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
      // TODO: Implement delete confirmation dialog
      console.log('Delete', params.data.idOperadora);
    }
  }

  navigateToForm(): void {
    this.router.navigate(['/cadastros/operadoras/nova']);
  }
}