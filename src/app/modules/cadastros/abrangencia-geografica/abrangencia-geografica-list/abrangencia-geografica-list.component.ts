import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, CellClickedEvent } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AbrangenciaGeograficaService } from '../abrangencia-geografica.service';
import { AbrangenciaGeografica } from '../abrangencia-geografica.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';
import { AbrangenciaGeograficaFormComponent } from '../abrangencia-geografica-form/abrangencia-geografica-form.component';

@Component({
  selector: 'app-abrangencia-geografica-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  templateUrl: './abrangencia-geografica-list.component.html',
  styleUrls: ['./abrangencia-geografica-list.component.scss']
})
export class AbrangenciaGeograficaListComponent {
  gridOptions: GridOptions<AbrangenciaGeografica>;
  datasource!: IDatasource;
  private gridApi!: GridApi<AbrangenciaGeografica>;

  columnDefs: ColDef<AbrangenciaGeografica>[] = [
    { headerName: 'ID', field: 'id', width: 120, sortable: true, filter: true },
    { headerName: 'Descrição', field: 'descricao', flex: 1, sortable: true, filter: true },
    { headerName: 'Ações', width: 160, cellRenderer: () => `
      <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
      <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
    `, onCellClicked: (p: CellClickedEvent<AbrangenciaGeografica>) => {
      const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
      if (action === 'edit') this.openDialog(p.data!);
      if (action === 'delete') this.remove(p.data!);
    }}
  ];

  constructor(
    private service: AbrangenciaGeograficaService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private agGridLocaleService: AgGridLocaleService
  ) {
    this.datasource = this.createDatasource();
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), theme: 'legacy', rowModelType: 'infinite', pagination: true, paginationPageSize: 20, cacheBlockSize: 20 };
  }

  onGridReady(params: GridReadyEvent<AbrangenciaGeografica>): void { this.gridApi = params.api; }

  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'descricao';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';
        this.service.getAbrangenciasPaged(page, pageSize, sort, order).subscribe({
          next: data => params.successCallback(data.content, data.totalElements),
          error: () => params.failCallback()
        });
      }
    };
  }

  openDialog(row?: AbrangenciaGeografica): void {
    const form: FormGroup = this.fb.group({ id: [row?.id || null], descricao: [row?.descricao || '', Validators.required] });
    const ref = this.dialog.open(AbrangenciaGeograficaFormComponent, { width: '520px', data: { form, title: row ? 'Editar' : 'Novo' }, disableClose: true });
    ref.afterClosed().subscribe(res => {
      if (res?.saved) {
        const payload = { id: form.value.id, descricao: form.value.descricao };
        const obs = payload.id ? this.service.update(payload.id, payload) : this.service.create(payload);
        obs.subscribe(() => this.gridApi?.refreshInfiniteCache());
      }
    });
  }

  remove(row: AbrangenciaGeografica): void { this.service.delete(row.id).subscribe(() => this.gridApi?.refreshInfiniteCache()); }
}
