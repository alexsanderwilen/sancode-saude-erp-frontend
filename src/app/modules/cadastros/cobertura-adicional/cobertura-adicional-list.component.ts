import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoberturaAdicionalService } from './cobertura-adicional.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { BaseModalFormComponent } from '../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-cobertura-adicional-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4>Coberturas Adicionais</h4>
    <button mat-stroked-button color="primary" (click)="openDialog()">Novo</button>
  </div>
  <ag-grid-angular class="ag-theme-quartz" style="width: 100%; height: 500px;"
                   [gridOptions]="gridOptions" [rowData]="rowData" [columnDefs]="columnDefs">
  </ag-grid-angular>
  `
})
export class CoberturaAdicionalListComponent {
  rowData: any[] = [];
  gridOptions: GridOptions;
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 100 },
    { headerName: 'Descrição', field: 'descricao', flex: 1 },
    { headerName: 'Tipo', field: 'tipo', width: 160 },
    { headerName: 'Obrigatória ANS', field: 'obrigatoriaAns', width: 160 },
    { headerName: 'Ações', width: 160, cellRenderer: () => `
      <button data-action=\"edit\" class=\"btn btn-sm btn-outline-primary\">Editar</button>
      <button data-action=\"delete\" class=\"btn btn-sm btn-outline-danger\">Excluir</button>
    `, onCellClicked: (p: any) => {
      const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
      if (action === 'edit') this.openDialog(p.data);
      if (action === 'delete') this.remove(p.data);
    }}
  ];

  constructor(private service: CoberturaAdicionalService, private dialog: MatDialog, private fb: FormBuilder, private agGridLocaleService: AgGridLocaleService) {
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), pagination: true, paginationPageSize: 20 };
    this.load();
  }

  load(): void { this.service.getCoberturas().subscribe(d => this.rowData = d); }

  openDialog(row?: any): void {
    const form: FormGroup = this.fb.group({
      id: [row?.id || null],
      descricao: [row?.descricao || '', Validators.required],
      tipo: [row?.tipo || ''],
      obrigatoriaAns: [row?.obrigatoriaAns || false]
    });
    const ref = this.dialog.open(CoberturaAdicionalDialogComponent, { width: '640px', data: { form, title: row ? 'Editar' : 'Novo' } });
    ref.afterClosed().subscribe(res => {
      if (res?.saved) {
        const payload = form.value;
        const obs = payload.id ? this.service.update(payload.id, payload) : this.service.create(payload);
        obs.subscribe(() => this.load());
      }
    });
  }

  remove(row: any): void { this.service.delete(row.id).subscribe(() => this.load()); }
}

@Component({
  selector: 'app-cobertura-adicional-dialog',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  template: `
  <app-base-modal-form [title]="data.title" (save)="onSave()" (cancel)="onCancel()">
    <form [formGroup]="data.form">
      <mat-form-field class="full-width">
        <mat-label>Descrição</mat-label>
        <input matInput formControlName="descricao" required>
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>Tipo</mat-label>
        <input matInput formControlName="tipo">
      </mat-form-field>
      <mat-checkbox formControlName="obrigatoriaAns">Obrigatória ANS</mat-checkbox>
    </form>
  </app-base-modal-form>
  `
})
export class CoberturaAdicionalDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, title: string }, private ref: MatDialogRef<CoberturaAdicionalDialogComponent>) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';
