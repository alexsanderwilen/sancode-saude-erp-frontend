import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanoService } from '../plano.service';
import { AcomodacaoService } from '../../acomodacao/acomodacao.service';
import { Acomodacao } from '../../acomodacao/acomodacao.model';
import { BaseModalFormComponent } from '../../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-plano-acomodacoes-tab',
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
    <button type="button" mat-stroked-button color="primary" (click)="openAddDialog()">Adicionar</button>
  </div>
  <ag-grid-angular class="ag-theme-alpine" style="width: 100%; height: 320px;"
                   [gridOptions]="gridOptions"
                   [rowData]="rowData"
                   [columnDefs]="columnDefs">
  </ag-grid-angular>
  `
})
export class PlanoAcomodacoesTabComponent implements OnInit {
  @Input() planoId?: number;
  @Input() selectedIds: number[] = [];
  @Output() selectedIdsChange = new EventEmitter<number[]>();

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 100, sortable: true, filter: true },
    { headerName: 'Acomodação', field: 'acomodacao.descricao', flex: 1, sortable: true, filter: true },
    { headerName: 'Ações', width: 120, cellRenderer: () => `
        <button type="button" data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
      onCellClicked: (p: any) => {
        if (p?.event) { try { p.event.preventDefault(); p.event.stopPropagation(); } catch {} }
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
    private acomodacaoService: AcomodacaoService,
    private agGridLocaleService: AgGridLocaleService
  ) {}

  ngOnInit(): void {
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), theme: 'legacy', pagination: true, paginationPageSize: 10 };
    this.load();
  }

  private load(): void {
    if (this.planoId) {
      this.planoService.listPlanoAcomodacoes(this.planoId).subscribe(d => this.rowData = d);
    } else {
      this.refreshLocalRowData();
    }
  }

  private refreshLocalRowData(): void {
    this.acomodacaoService.getAcomodacoes().subscribe(opts => {
      const map = new Map<number, Acomodacao>(opts.map(o => [o.id, o] as const));
      this.rowData = (this.selectedIds || [])
        .map(id => map.get(id))
        .filter((o): o is Acomodacao => !!o)
        .map(o => ({ acomodacao: { id: o.id, descricao: o.descricao } }));
    });
  }

  openAddDialog(): void {
    const form: FormGroup = this.fb.group({ acomodacaoId: [null, Validators.required] });
    const ref = this.dialog.open(PlanoAcomodacoesDialogComponent, {
      width: '520px',
      data: {
        title: 'Adicionar Acomodação',
        form,
        options$: this.acomodacaoService.getAcomodacoes(),
        label: 'Acomodação'
      },
      disableClose: true,
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) {
        const id = form.value.acomodacaoId as number;
        if (this.planoId) {
          this.planoService.addPlanoAcomodacao(this.planoId, id).subscribe(() => this.load());
        } else if (id != null && !this.selectedIds.includes(id)) {
          this.selectedIds = [...this.selectedIds, id];
          this.selectedIdsChange.emit(this.selectedIds);
          this.refreshLocalRowData();
        }
      }
    });
  }

  remove(row: any): void {
    if (this.planoId) {
      this.planoService.deletePlanoAcomodacao(row.id).subscribe(() => this.load());
    } else {
      const id = row?.acomodacao?.id as number;
      if (id != null) {
        this.selectedIds = this.selectedIds.filter(x => x !== id);
        this.selectedIdsChange.emit(this.selectedIds);
        this.refreshLocalRowData();
      }
    }
  }
}

@Component({
  selector: 'app-plano-acomodacoes-dialog',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  template: `
  <app-base-modal-form [title]="data.title" (save)="onSave()" (cancel)="onCancel()">
    <form [formGroup]="data.form">
      <mat-form-field class="full-width">
        <mat-label>{{ data.label }}</mat-label>
        <mat-select formControlName="acomodacaoId" required>
          <mat-option *ngFor="let opt of (data.options$ | async)" [value]="opt.id">{{ opt.descricao }}</mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  </app-base-modal-form>
  `
})
export class PlanoAcomodacoesDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, form: FormGroup, options$: Observable<Acomodacao[]>, label: string },
    private ref: MatDialogRef<PlanoAcomodacoesDialogComponent>
  ) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}