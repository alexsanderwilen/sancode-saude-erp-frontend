import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanoService } from '../plano.service';
import { CoberturaAdicionalService } from '../../cobertura-adicional/cobertura-adicional.service';
import { CoberturaAdicional } from '../../cobertura-adicional/cobertura-adicional.model';
import { BaseModalFormComponent } from '../../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-plano-coberturas-adicionais-tab',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  template: `
  <div class="mb-2">
    <button type="button" mat-stroked-button color="primary" (click)="openAddDialog()">Adicionar</button>
  </div>
  <ag-grid-angular class="ag-theme-quartz" style="width: 100%; height: 320px;"
                   [gridOptions]="gridOptions"
                   [rowData]="rowData"
                   [columnDefs]="columnDefs">
  </ag-grid-angular>
  `
})
export class PlanoCoberturasAdicionaisTabComponent implements OnInit {
  @Input() planoId?: number;
  @Input() selectedIds: number[] = [];
  @Output() selectedIdsChange = new EventEmitter<number[]>();

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 90, sortable: true, filter: true },
    { headerName: 'Cobertura', field: 'coberturaAdicional.descricao', flex: 1, sortable: true, filter: true },
    { headerName: 'Inclusa', field: 'inclusa', width: 120, sortable: true, filter: true },
    { headerName: 'Observação', field: 'observacao', flex: 1, sortable: true, filter: true },
    { headerName: 'Ações', width: 180, cellRenderer: () => `
        <button type="button" data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button type="button" data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
      onCellClicked: (p: any) => {
        if (p?.event) { try { p.event.preventDefault(); p.event.stopPropagation(); } catch {} }
        const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
        if (action === 'delete') this.remove(p.data);
        if (action === 'edit') this.openEditDialog(p.data);
      }
    }
  ];
  gridOptions: GridOptions = { rowSelection: 'single' };
  rowData: any[] = [];

  constructor(
    private planoService: PlanoService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private coberturaService: CoberturaAdicionalService,
    private agGridLocaleService: AgGridLocaleService
  ) {}

  ngOnInit(): void { 
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), pagination: true, paginationPageSize: 10 }; 
    this.load();
  }

  private load(): void { 
    if (this.planoId) {
      this.planoService.listPlanoCoberturas(this.planoId).subscribe(d => this.rowData = d); 
    } else {
      this.refreshLocalRowData();
    }
  }

  private refreshLocalRowData(): void {
    this.coberturaService.getCoberturas().subscribe(opts => {
      const map = new Map<number, CoberturaAdicional>(opts.map(o => [o.id, o] as const));
      this.rowData = (this.selectedIds || [])
        .map(id => map.get(id))
        .filter((o): o is CoberturaAdicional => !!o)
        .map(o => ({ coberturaAdicional: { id: o.id, descricao: o.descricao }, inclusa: true, observacao: '' }));
    });
  }

  openAddDialog(): void {
    const form: FormGroup = this.fb.group({
      coberturaId: [null, Validators.required],
      inclusa: [true],
      observacao: ['']
    });
    const ref = this.dialog.open(PlanoCoberturasDialogComponent, {
      width: '620px',
      data: {
        title: 'Adicionar Cobertura',
        form,
        options$: this.coberturaService.getCoberturas(),
        label: 'Cobertura'
      },
      disableClose: true,
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) {
        const v = form.value;
        if (this.planoId) {
          this.planoService.addPlanoCobertura(this.planoId, v.coberturaId, v.inclusa, v.observacao).subscribe(() => this.load());
        } else {
          const id = v.coberturaId as number;
          if (id != null && !this.selectedIds.includes(id)) {
            this.selectedIds = [...this.selectedIds, id];
            this.selectedIdsChange.emit(this.selectedIds);
            this.refreshLocalRowData();
          }
        }
      }
    });
  }

  openEditDialog(row: any): void {
    if (!this.planoId) { return; }
    const form: FormGroup = this.fb.group({
      coberturaId: [row.coberturaAdicional?.id, Validators.required],
      inclusa: [row.inclusa],
      observacao: [row.observacao]
    });
    const ref = this.dialog.open(PlanoCoberturasDialogComponent, {
      width: '620px',
      data: {
        title: 'Editar Cobertura',
        form,
        options$: this.coberturaService.getCoberturas(),
        label: 'Cobertura'
      },
      disableClose: true,
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) {
        const v = form.value;
        this.planoService.updatePlanoCobertura(row.id, { coberturaId: v.coberturaId, inclusa: v.inclusa, observacao: v.observacao })
          .subscribe(() => this.load());
      }
    });
  }

  remove(row: any): void { 
    if (this.planoId) {
      this.planoService.deletePlanoCobertura(row.id).subscribe(() => this.load()); 
    } else {
      const id = row?.coberturaAdicional?.id as number;
      if (id != null) {
        this.selectedIds = this.selectedIds.filter(x => x !== id);
        this.selectedIdsChange.emit(this.selectedIds);
        this.refreshLocalRowData();
      }
    }
  }
}

@Component({
  selector: 'app-plano-coberturas-dialog',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule, ReactiveFormsModule],
  template: `
  <app-base-modal-form [title]="data.title" (save)="onSave()" (cancel)="onCancel()">
    <form [formGroup]="data.form">
      <mat-form-field class="full-width">
        <mat-label>{{ data.label }}</mat-label>
        <mat-select formControlName="coberturaId" required>
          <mat-option *ngFor="let opt of (data.options$ | async)" [value]="opt.id">{{ opt.descricao }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-checkbox formControlName="inclusa">Inclusa</mat-checkbox>
      <mat-form-field class="full-width">
        <mat-label>Observação</mat-label>
        <input matInput formControlName="observacao">
      </mat-form-field>
    </form>
  </app-base-modal-form>
  `
})
export class PlanoCoberturasDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, form: FormGroup, options$: Observable<CoberturaAdicional[]>, label: string },
    private ref: MatDialogRef<PlanoCoberturasDialogComponent>
  ) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}

