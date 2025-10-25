import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlanoService } from '../plano.service';
import { TipoPagamentoService } from '../../tipo-pagamento/tipo-pagamento.service';
import { TipoPagamento } from '../../tipo-pagamento/tipo-pagamento.model';
import { BaseModalFormComponent } from '../../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-plano-tipos-pagamento-tab',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
  <div class="mb-2">
    <button mat-stroked-button color="primary" (click)="openAddDialog()" [disabled]="!planoId">Adicionar</button>
  </div>
  <ag-grid-angular class="ag-theme-quartz" style="width: 100%; height: 320px;"
                   [gridOptions]="gridOptions"
                   [rowData]="rowData"
                   [columnDefs]="columnDefs">
  </ag-grid-angular>

  <ng-template #addDialog>
    <!-- Placeholder for AOT -->
  </ng-template>
  `
})
export class PlanoTiposPagamentoTabComponent implements OnInit {
  @Input() planoId!: number;
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 100, sortable: true, filter: true },
    { headerName: 'Tipo de Pagamento', field: 'tipoPagamento.descricao', flex: 1, sortable: true, filter: true },
    { headerName: 'Ações', width: 120, cellRenderer: () => `
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
      onCellClicked: (p: any) => {
        const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
        if (action === 'delete') this.remove(p.data);
      }
    }
  ];
  gridOptions: GridOptions = { rowSelection: 'single' };
  rowData: any[] = [];

  constructor(
    private planoService: PlanoService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private tipoPagamentoService: TipoPagamentoService,
    private agGridLocaleService: AgGridLocaleService
  ) {}

  ngOnInit(): void {
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), pagination: true, paginationPageSize: 10 };
    if (this.planoId) this.load();
  }

  load(): void {
    this.planoService.listPlanoTiposPagamento(this.planoId).subscribe(d => this.rowData = d);
  }

  openAddDialog(): void {
    const form: FormGroup = this.fb.group({ tipoPagamentoId: [null, Validators.required] });
    const ref = this.dialog.open(DialogWrapperComponent, {
      width: '520px',
      data: {
        title: 'Adicionar Tipo de Pagamento',
        form,
        options$: this.tipoPagamentoService.getTiposPagamento(),
        label: 'Tipo de Pagamento'
      }
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) {
        this.planoService.addPlanoTipoPagamento(this.planoId, form.value.tipoPagamentoId).subscribe(() => this.load());
      }
    });
  }

  remove(row: any): void {
    this.planoService.deletePlanoTipoPagamento(row.id).subscribe(() => this.load());
  }
}

// Dialog wrapper using BaseModalFormComponent
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-wrapper',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  template: `
  <app-base-modal-form [title]="data.title" (save)="onSave()" (cancel)="onCancel()">
    <form [formGroup]="data.form">
      <mat-form-field class="full-width">
        <mat-label>{{ data.label }}</mat-label>
        <mat-select formControlName="tipoPagamentoId" required>
          <mat-option *ngFor="let opt of (data.options$ | async)" [value]="opt.id">{{ opt.descricao }}</mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  </app-base-modal-form>
  `
})
export class DialogWrapperComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, form: FormGroup, options$: Observable<TipoPagamento[]>, label: string },
    private ref: MatDialogRef<DialogWrapperComponent>
  ) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';
