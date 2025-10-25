import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { BaseModalFormComponent } from '../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OperadoraService } from '../operadora.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-plano-base-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4>Planos Base</h4>
    <button mat-stroked-button color="primary" (click)="openDialog()">Novo</button>
  </div>
  <ag-grid-angular class="ag-theme-quartz" style="width: 100%; height: 500px;"
                   [gridOptions]="gridOptions" [rowData]="rowData" [columnDefs]="columnDefs">
  </ag-grid-angular>
  `
})
export class PlanoBaseListComponent {
  rowData: any[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 120 },
    { headerName: 'Operadora', valueGetter: (p: any) => p.data?.operadora?.razaoSocial || p.data?.operadora?.nomeFantasia || '-', flex: 1 },
    { headerName: 'Ativo', field: 'ativo', width: 120 },
    { headerName: 'Ações', width: 180, cellRenderer: () => `
      <button data-action=\"edit\" class=\"btn btn-sm btn-outline-primary\">Editar</button>
      <button data-action=\"delete\" class=\"btn btn-sm btn-outline-danger\">Excluir</button>
    `, onCellClicked: (p: any) => {
      const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
      if (action === 'edit') this.openDialog(p.data);
      if (action === 'delete') this.remove(p.data);
    }}
  ];

  private apiUrl = `${environment.apiUrl}/planos-base`;
  gridOptions: GridOptions;
  constructor(private http: HttpClient, private dialog: MatDialog, private fb: FormBuilder, private operadoraService: OperadoraService, private agGridLocaleService: AgGridLocaleService) {
    this.gridOptions = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      pagination: true,
      paginationPageSize: 20
    };
    this.load();
  }

  load(): void { this.http.get<any[]>(this.apiUrl).subscribe(d => this.rowData = d); }

  openDialog(row?: any): void {
    const form: FormGroup = this.fb.group({
      id: [row?.id || null],
      operadoraId: [row?.operadora?.idOperadora || null, Validators.required],
      ativo: [row?.ativo ?? true]
    });
    const operadoras$ = this.operadoraService.getOperadoras(0, 1000, 'razaoSocial', 'asc').pipe(map(p => p.content));
    const ref = this.dialog.open(PlanoBaseDialogComponent, { width: '640px', data: { form, title: row ? 'Editar' : 'Novo', operadoras$ } });
    ref.afterClosed().subscribe(res => {
      if (res?.saved) {
        const payload: any = { id: form.value.id, operadora: form.value.operadoraId ? { idOperadora: form.value.operadoraId } : null, ativo: form.value.ativo };
        const obs = payload.id ? this.http.put(`${this.apiUrl}/${payload.id}`, payload) : this.http.post(this.apiUrl, payload);
        obs.subscribe(() => this.load());
      }
    });
  }

  remove(row: any): void { this.http.delete(`${this.apiUrl}/${row.id}`).subscribe(() => this.load()); }
}

@Component({
  selector: 'app-plano-base-dialog',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  template: `
  <app-base-modal-form [title]="data.title" (save)="onSave()" (cancel)="onCancel()">
    <form [formGroup]="data.form">
      <mat-form-field class="full-width">
        <mat-label>Operadora</mat-label>
        <mat-select formControlName="operadoraId" required>
          <mat-option *ngFor="let op of (data.operadoras$ | async)" [value]="op.idOperadora">{{ op.razaoSocial || op.nomeFantasia }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-checkbox formControlName="ativo">Ativo</mat-checkbox>
    </form>
  </app-base-modal-form>
  `
})
export class PlanoBaseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<PlanoBaseDialogComponent>) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}


