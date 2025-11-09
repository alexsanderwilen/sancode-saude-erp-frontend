import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, CellClickedEvent } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';
import { TipoPagamentoService } from '../tipo-pagamento.service';
import { TipoPagamentoFormComponent } from '../tipo-pagamento-form/tipo-pagamento-form.component';
import { TipoPagamento } from '../tipo-pagamento.model';

@Component({
  selector: 'app-tipo-pagamento-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  templateUrl: './tipo-pagamento-list.component.html',
  styleUrls: ['./tipo-pagamento-list.component.scss']
})
export class TipoPagamentoListComponent {
  gridOptions: GridOptions<TipoPagamento>;
  datasource!: IDatasource;
  private gridApi!: GridApi<TipoPagamento>;

  columnDefs: ColDef<TipoPagamento>[] = [
    { headerName: 'ID', field: 'id', width: 120 },
    { headerName: 'Descrição', field: 'descricao', flex: 1 },
    {
      headerName: 'Ações',
      width: 160,
      cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
      onCellClicked: (p: CellClickedEvent<TipoPagamento>) => {
        const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
        if (action === 'edit') this.openDialog(p.data!);
        if (action === 'delete') this.remove(p.data!);
      }
    }
  ];

  constructor(
    private service: TipoPagamentoService,
    private dialog: MatDialog,
    private fb: FormBuilder,
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
      defaultColDef: { sortable: true, filter: true }
    };
  }

  onGridReady(params: GridReadyEvent<TipoPagamento>): void { this.gridApi = params.api; }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'descricao';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';
        this.service.getTiposPagamentoPaged(page, pageSize, sort, order).subscribe({
          next: data => params.successCallback(data.content, data.totalElements),
          error: () => params.failCallback()
        });
      }
    };
  }

  openDialog(row?: TipoPagamento): void {
    const form: FormGroup = this.fb.group({ id: [row?.id || null], descricao: [row?.descricao || '', Validators.required] });
    const ref = this.dialog.open(TipoPagamentoFormComponent, { width: '520px', data: { form, title: row ? 'Editar' : 'Novo' }, disableClose: true });
    ref.afterClosed().subscribe(res => {
      if (res?.saved) {
        const payload = { id: form.value.id, descricao: form.value.descricao };
        const obs = payload.id ? this.service.update(payload.id, payload) : this.service.create(payload);
        obs.subscribe(() => this.gridApi?.refreshInfiniteCache());
      }
    });
  }

  remove(row: TipoPagamento): void { this.service.delete(row.id).subscribe(() => this.gridApi?.refreshInfiniteCache()); }
}
