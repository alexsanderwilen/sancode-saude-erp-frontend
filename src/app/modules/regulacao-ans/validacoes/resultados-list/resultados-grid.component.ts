import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
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
  columnDefs: ColDef[] = [
    { headerName: 'Regra', field: 'regraCodigo', width: 140 },
    { headerName: 'Título', field: 'titulo', flex: 1 },
    { headerName: 'Severidade', field: 'severidade', width: 120 },
    { headerName: 'Entidade', field: 'entidade', width: 140 },
    { headerName: 'ID', field: 'entidadeId', width: 220 },
    { headerName: 'Mensagem', field: 'mensagem', flex: 2 },
    { headerName: 'Ações', width: 180, cellRenderer: (p: any) => this.actionButtons(p.data), onCellClicked: (p: any) => this.onAction(p) },
    { headerName: 'Criado em', field: 'criadoEm', width: 200 }
  ];
  gridOptions: GridOptions = { rowModelType: 'infinite', pagination: true, paginationPageSize: 20, cacheBlockSize: 20 };
  private gridApi?: GridApi;
  constructor(private svc: ValidationsService, private exports: ExportsService) {}
  onGridReady(e: any) { this.gridApi = e.api; this.refresh(); }
  datasource(): IDatasource {
    return { getRows: (params: IGetRowsParams) => {
      const pageSize = this.gridOptions.paginationPageSize || 20;
      const page = params.startRow / pageSize;
      const sortModel = (params as any).sortModel as Array<{ colId: string; sort: 'asc'|'desc' }> | undefined;
      const sort = sortModel && sortModel.length ? sortModel[0].colId : undefined;
      const order = sortModel && sortModel.length ? sortModel[0].sort : undefined;
      this.svc.results(this.execucaoId, page, pageSize, { severidade: this.severidade || undefined, entidade: this.entidade || undefined, de: this.de || undefined, ate: this.ate || undefined, sort, order })
        .subscribe({ next: (p: any) => params.successCallback(p.content, p.totalElements), error: () => params.failCallback() });
    }};
  }
  refresh() { if (this.gridApi) { (this.gridApi as any).setGridOption('datasource', this.datasource()); } }

  actionButtons(row: any): string {
    if (!row) return '';
    return `
      <button class="btn btn-sm btn-outline-primary" data-act="corrigir">Corrigir</button>
      <button class="btn btn-sm btn-outline-success ms-1" data-act="revalidar">Revalidar</button>
    `;
  }
  onAction(p: any) {
    const act = (p.event?.target as HTMLElement)?.getAttribute('data-act');
    if (!act) return;
    const row = p.data;
    if (act === 'corrigir') {
      this.openCorrection(row);
    } else if (act === 'revalidar') {
      const escopo = row?.entidade === 'BENEFICIARIO' ? 'BENEFICIARIO' : (row?.entidade === 'PLANO' ? 'PLANO' : 'GERAL');
      this.svc.run('MANUAL', escopo).subscribe(() => this.refresh());
    }
  }
  openCorrection(row: any) {
    if (row?.entidade === 'BENEFICIARIO' && row?.entidadeId) {
      window.open(`/cadastros/beneficiarios/editar/${row.entidadeId}`, '_blank');
    } else if (row?.entidade === 'PLANO' && row?.entidadeId) {
      // Sem rota direta para modal de plano-base; encaminha para lista com query param
      window.open(`/cadastros/gestao-planos/planos-base?editId=${row.entidadeId}`, '_blank');
    }
  }

  exportarCSV() {
    const params: any = {};
    if (this.execucaoId != null) params.execucaoId = this.execucaoId;
    if (this.severidade) params.severidade = this.severidade;
    if (this.entidade) params.entidade = this.entidade;
    if (this.de) params.de = this.de;
    if (this.ate) params.ate = this.ate;
    this.exports.create('RELATORIO_INCONSISTENCIAS', params).subscribe((r: any) => {
      const id = r?.idExport ?? r?.id;
      if (!id) return;
      this.exports.download(id).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inconsistencias.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
  }
}

