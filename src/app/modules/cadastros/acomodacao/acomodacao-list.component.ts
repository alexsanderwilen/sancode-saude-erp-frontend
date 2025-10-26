import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, IDatasource, IGetRowsParams, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AcomodacaoService } from './acomodacao.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { BaseModalFormComponent } from '../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../environments/environment';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acomodacao-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4>Acomodações</h4>
    <button mat-stroked-button color="primary" (click)="openDialog()">Novo</button>
  </div>
  <ag-grid-angular class="ag-theme-quartz" style="width: 100%; height: 500px;"
                   [gridOptions]="gridOptions" [datasource]="datasource" [columnDefs]="columnDefs" (gridReady)="onGridReady($event)">
  </ag-grid-angular>
  `
})
export class AcomodacaoListComponent {
  rowData: any[] = [];
  gridOptions: GridOptions;
  datasource!: IDatasource;
  private gridApi!: GridApi;
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 120, sortable: true, filter: true },
    { headerName: 'Descrição', field: 'descricao', flex: 1, sortable: true, filter: true },
    { headerName: 'Ações', width: 160, cellRenderer: () => `
      <button data-action=\"edit\" class=\"btn btn-sm btn-outline-primary\">Editar</button>
      <button data-action=\"delete\" class=\"btn btn-sm btn-outline-danger\">Excluir</button>
    `, onCellClicked: (p: any) => {
      const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
      if (action === 'edit') this.openDialog(p.data);
      if (action === 'delete') this.remove(p.data);
    }}
  ];

  private apiUrl = `${environment.apiUrl}/acomodacoes`;
  constructor(private acomodacaoService: AcomodacaoService, private dialog: MatDialog, private fb: FormBuilder, private http: HttpClient, private agGridLocaleService: AgGridLocaleService) {
    this.datasource = this.createDatasource();
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), rowModelType: 'infinite', pagination: true, paginationPageSize: 20, cacheBlockSize: 20 };
  }
  load(): void { /* no-op: now uses datasource */ }

  onGridReady(params: GridReadyEvent): void { this.gridApi = params.api; }
  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'descricao';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';
        this.acomodacaoService.getAcomodacoesPaged(page, pageSize, sort, order).subscribe({
          next: data => params.successCallback(data.content, data.totalElements),
          error: () => params.failCallback()
        });
      }
    };
  }
  openDialog(row?: any): void {
    const form: FormGroup = this.fb.group({ id: [row?.id || null], descricao: [row?.descricao || '', Validators.required] });
    const ref = this.dialog.open(AcomodacaoDialogComponent, { width: '520px', data: { form, title: row ? 'Editar' : 'Novo' } });
    ref.afterClosed().subscribe(res => {
      if (res?.saved) {
        const payload = { id: form.value.id, descricao: form.value.descricao } as any;
        const obs = payload.id ? this.http.put(`${this.apiUrl}/${payload.id}`, payload) : this.http.post(this.apiUrl, payload);
        obs.subscribe(() => this.gridApi?.refreshInfiniteCache());
      }
    });
  }
  remove(row: any): void { this.http.delete(`${this.apiUrl}/${row.id}`).subscribe(() => this.gridApi?.refreshInfiniteCache()); }
}

@Component({
  selector: 'app-acomodacao-dialog',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
  <app-base-modal-form [title]="data.title" (save)="onSave()" (cancel)="onCancel()">
    <form [formGroup]="data.form">
      <mat-form-field class="full-width">
        <mat-label>Descrição</mat-label>
        <input matInput formControlName="descricao" required>
      </mat-form-field>
    </form>
  </app-base-modal-form>
  `
})
export class AcomodacaoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, title: string }, private ref: MatDialogRef<AcomodacaoDialogComponent>) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}
