import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, IDatasource, IGetRowsParams, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import { ValidationResult } from '../../models/validation.model';
import { ValidationsService } from '../../services/validations.service';
import { ExportsService } from '../../services/exports.service';

@Component({
  selector: 'app-ans-resultados-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  templateUrl: './resultados-grid.component.html',
  styleUrls: ['./resultados-grid.component.css']
})
export class ResultadosGridComponent {
  execucaoId: number | null = null;
  severidade = '';
  entidade = '';
  de = '';
  ate = '';
  columnDefs: ColDef<ValidationResult>[] = [
    { headerName: 'Regra', field: 'regraCodigo', width: 140 },
    { headerName: 'Título', field: 'titulo', flex: 1 },
    { headerName: 'Severidade', field: 'severidade', width: 120 },
    { headerName: 'Entidade', field: 'entidade', width: 140 },
    { headerName: 'ID', field: 'entidadeId', width: 220 },
    { headerName: 'Mensagem', field: 'mensagem', flex: 2 },
    { headerName: 'Ações', width: 180, cellRenderer: (p: { data: ValidationResult }) => this.actionButtons(p.data), onCellClicked: (p: CellClickedEvent<ValidationResult>) => this.onAction(p) },
    { headerName: 'Criado em', field: 'criadoEm', width: 200 }
  ];
  gridOptions: GridOptions<ValidationResult> = { rowModelType: 'infinite', pagination: true, paginationPageSize: 20, cacheBlockSize: 20 };
  private gridApi?: GridApi<ValidationResult>;
  constructor(private svc: ValidationsService, private exports: ExportsService) {}
  onGridReady(e: GridReadyEvent<ValidationResult>) { this.gridApi = e.api; this.refresh(); }
  datasource(): IDatasource {
    return { getRows: (params: IGetRowsParams) => {
      const pageSize = this.gridOptions.paginationPageSize || 20;
      const page = params.startRow / pageSize;
      const sortModel = (params as unknown as { sortModel?: Array<{ colId: string; sort: 'asc'|'desc' }> }).sortModel;
      const sort = sortModel && sortModel.length ? sortModel[0].colId : undefined;
      const order = sortModel && sortModel.length ? sortModel[0].sort : undefined;
      this.svc.results(this.execucaoId, page, pageSize, { severidade: this.severidade || undefined, entidade: this.entidade || undefined, de: this.de || undefined, ate: this.ate || undefined, sort, order })
        .subscribe({ next: (p: { content: ValidationResult[]; totalElements: number }) => params.successCallback(p.content, p.totalElements), error: () => params.failCallback() });
    }};
  }
  refresh() { if (this.gridApi) { (this.gridApi as unknown as { setGridOption: (k: string, v: unknown) => void }).setGridOption('datasource', this.datasource()); } }

  actionButtons(row: ValidationResult): string {
    if (!row) return '';
    return `
      <button class="btn btn-sm btn-outline-primary" data-act="corrigir">Corrigir</button>
      <button class="btn btn-sm btn-outline-success ms-1" data-act="revalidar">Revalidar</button>
    `;
  }
  onAction(p: CellClickedEvent<ValidationResult>) {
    const act = (p.event?.target as HTMLElement | null)?.getAttribute('data-act');
    if (!act) return;
    const row = p.data;
    if (!row) return;
    if (act === 'corrigir') {
      this.openCorrection(row);
    } else if (act === 'revalidar') {
      const escopo = row?.entidade === 'BENEFICIARIO' ? 'BENEFICIARIO' : (row?.entidade === 'PLANO' ? 'PLANO' : 'GERAL');
      this.svc.run('MANUAL', escopo).subscribe(() => this.refresh());
    }
  }
  openCorrection(row: ValidationResult) {
    if (row?.entidade === 'BENEFICIARIO' && row?.entidadeId) {
      window.open(`/cadastros/beneficiarios/editar/${row.entidadeId}`, '_blank');
    } else if (row?.entidade === 'PLANO' && row?.entidadeId) {
      // Sem rota direta para modal de plano-base; encaminha para lista com query param
      window.open(`/cadastros/gestao-planos/planos-base?editId=${row.entidadeId}`, '_blank');
    }
  }

  exportarCSV() {
    const params: Record<string, string | number> = {};
    if (this.execucaoId != null) params['execucaoId'] = this.execucaoId;
    if (this.severidade) params['severidade'] = this.severidade;
    if (this.entidade) params['entidade'] = this.entidade;
    if (this.de) params['de'] = this.de;
    if (this.ate) params['ate'] = this.ate;
    this.exports.create('RELATORIO_INCONSISTENCIAS', params).subscribe((r: { idExport?: number; id?: number }) => {
      const id = r?.idExport ?? r?.id as number | undefined;
      if (!id) return;
      this.exports.download(id).subscribe(resp => {
        const blob = resp.body as Blob;
        const cd = resp.headers.get('content-disposition') || '';
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd || '');
        let filename = 'inconsistencias.csv';
        if (match) filename = decodeURIComponent(match[1] || match[2]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
  }
}
