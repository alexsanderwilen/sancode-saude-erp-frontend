import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoberturaAdicionalService } from '../cobertura-adicional.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoberturaAdicionalFormComponent } from '../cobertura-adicional-form/cobertura-adicional-form.component';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-cobertura-adicional-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  templateUrl: './cobertura-adicional-list.component.html',
  styleUrls: ['./cobertura-adicional-list.component.scss']
})
export class CoberturaAdicionalListComponent {
  rowData: any[] = [];
  gridOptions: GridOptions;
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 100, sortable: true, filter: true },
    { headerName: 'Descrição', field: 'descricao', flex: 1, sortable: true, filter: true },
    { headerName: 'Tipo', field: 'tipo', width: 160, sortable: true, filter: true },
    { headerName: 'Obrigatória ANS', field: 'obrigatoriaAns', width: 160, sortable: true, filter: true },
    { headerName: 'Descrição Detalhada', field: 'descricaoDetalhada', flex: 1, sortable: true, filter: true },
    { headerName: 'Ações', width: 160, cellRenderer: () => `
      <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
      <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
    `, onCellClicked: (p: any) => {
      const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
      if (action === 'edit') this.openDialog(p.data);
      if (action === 'delete') this.remove(p.data);
    }}
  ];

  constructor(
    private service: CoberturaAdicionalService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private agGridLocaleService: AgGridLocaleService
  ) {
    this.gridOptions = { ...this.agGridLocaleService.getDefaultGridOptions(), pagination: true, paginationPageSize: 20 };
    this.load();
  }

  load(): void { this.service.getCoberturas().subscribe(d => this.rowData = d); }

  openDialog(row?: any): void {
    const form: FormGroup = this.fb.group({
      id: [row?.id || null],
      descricao: [row?.descricao || '', Validators.required],
      descricaoDetalhada: [row?.descricaoDetalhada || ''],
      tipo: [row?.tipo || ''],
      obrigatoriaAns: [row?.obrigatoriaAns || false]
    });
    const ref = this.dialog.open(CoberturaAdicionalFormComponent, { width: '640px', data: { form, title: row ? 'Editar' : 'Novo' } });
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

