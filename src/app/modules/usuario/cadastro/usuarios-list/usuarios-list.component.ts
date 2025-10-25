import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, IDatasource, GridReadyEvent, CellClickedEvent, IGetRowsParams } from 'ag-grid-community';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-usuarios-list',
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
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent {

  private gridApi!: GridApi<Usuario>;
  public datasource!: IDatasource;
  public gridOptions: GridOptions<Usuario>;

  public columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    { headerName: 'Nome Completo', field: 'nomeCompleto', flex: 1, sortable: true, filter: true },
    { headerName: 'Username', field: 'username', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    {
      headerName: 'Status', field: 'status', width: 120, cellRenderer: (params: { value: string; }) => {
        const status = params.value;
        const badgeClass = status === 'ATIVO' ? 'badge text-bg-success' : 'badge text-bg-danger';
        return `<span class="${badgeClass}">${status}</span>`;
      }
    },
    {
      headerName: 'Ações',
      width: 150,
      cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
      sortable: false, filter: false
    }
  ];

  constructor(
    private usuarioService: UsuarioService,
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

  onGridReady(params: GridReadyEvent<Usuario>): void {
    this.gridApi = params.api;
  }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const page = params.startRow / this.gridOptions.paginationPageSize!;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'nomeCompleto';
        const order = sortModel.length ? sortModel[0].sort : 'asc';

        this.usuarioService.getUsuarios(page, this.gridOptions.paginationPageSize!, sort, order)
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
      this.router.navigate(['/usuarios/cadastro/edit', params.data.id]);
    } else if (action === 'delete') {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar Exclusão',
          message: `Tem certeza que deseja excluir o usuário ${params.data.nomeCompleto}?`
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.usuarioService.deleteUsuario(params.data.id!).subscribe({
            next: () => {
              this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
              this.gridApi.refreshInfiniteCache(); // Atualiza a grid
            },
            error: (err) => {
              console.error('Erro ao excluir usuário:', err);
              this.snackBar.open('Erro ao excluir usuário.', 'Fechar', { duration: 5000 });
            }
          });
        }
      });
    }
  }

  navigateToNew(): void {
    this.router.navigate(['/usuarios/cadastro/new']);
  }
}
