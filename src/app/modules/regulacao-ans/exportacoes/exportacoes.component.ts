import { Component, OnInit } from '@angular/core';
import { ExportsService } from '../services/exports.service';
import { SibService } from '../services/sib.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../services/validations.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-ans-exportacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './exportacoes.component.html',
  styleUrls: ['./exportacoes.component.css']
})
export class ExportacoesComponent implements OnInit {
  ultimoId?: number;
  execucaoId: number | null = null; severidade = ''; entidade = ''; de = ''; ate = '';
  competencia = '';
  // Tabs and data
  tab: 'execucoes'|'arquivos'|'rejeicoes' = 'execucoes';
  execucoes: any[] = []; totalExecucoes = 0; pageExec = 0; sizeExec = 10; loadingExec = false; expandedId?: number;
  topRejeicoes: { chave: string; count: number }[] = []; loadingRej = false;

  // AgGrid
  gridOptions: GridOptions = {};
  columnDefs: ColDef[] = [
    {
      headerName: 'Status', field: 'status', width: 140, sortable: true, resizable: true,
      cellRenderer: (params: any) => {
        const st = params?.value || '';
        const cls = st === 'CONCLUIDO' ? 'status-ok' : (st === 'ERRO' ? 'status-err' : 'status-warn');
        return `<span class="status-dot ${cls}"></span>${st || '—'}`;
      }
    },
    { headerName: 'ID Execução', field: 'id', width: 130, valueFormatter: (p: any) => p.value != null ? `#${p.value}` : '—', sortable: true, resizable: true },
    { headerName: 'Competência', field: 'parametros', valueGetter: (p: any) => this.compDe(p.data), sortable: true, resizable: true },
    { headerName: 'Início', field: 'inicio', valueFormatter: (p: any) => p.value || '—', resizable: true },
    { headerName: 'Fim', field: 'fim', valueFormatter: (p: any) => p.value || '—', resizable: true },
    { headerName: 'Total', field: 'total', valueFormatter: (p: any) => p.value ?? '—', width: 110, resizable: true },
    { headerName: 'OK', field: 'ok', valueFormatter: (p: any) => p.value ?? '—', width: 100, resizable: true },
    { headerName: 'Com Erro', field: 'erro', valueFormatter: (p: any) => p.value ?? '—', width: 120, resizable: true },
    {
      headerName: 'Ações', colId: 'acoes', width: 220, pinned: 'right', cellRenderer: () => {
        return `
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" data-action="detalhes"><i class="bi bi-eye"></i> Detalhes</button>
            <button class="btn btn-sm btn-outline-primary" data-action="baixar"><i class="bi bi-download"></i> SIB.txt</button>
          </div>`;
      }
    }
  ];
  defaultColDef: ColDef = { flex: 1, minWidth: 100, filter: true };

  constructor(
    private svc: ExportsService,
    private sib: SibService,
    private validations: ValidationsService,
    private agGridLocale: AgGridLocaleService
  ) {
    this.gridOptions = {
      ...this.agGridLocale.getDefaultGridOptions(),
      pagination: true,
      paginationPageSize: this.sizeExec,
      defaultColDef: this.defaultColDef
    };
  }

  ngOnInit(): void { this.loadExecucoes(); }
  setTab(t: 'execucoes'|'arquivos'|'rejeicoes') { this.tab = t; if (t === 'execucoes' || t === 'arquivos') this.loadExecucoes(); if (t === 'rejeicoes') this.loadTopRejeicoes(); }
  loadExecucoes(page: number = this.pageExec) {
    this.loadingExec = true;
    this.svc.list(page, this.sizeExec).subscribe(p => {
      this.execucoes = p.content || []; this.totalExecucoes = p.totalElements || 0; this.pageExec = p.number || 0; this.loadingExec = false;
    }, _ => this.loadingExec = false);
  }
  loadTopRejeicoes() {
    this.loadingRej = true;
    // pull first 200 results and group by regra/severidade to emulate "top" locally
    this.validations.results(this.execucaoId, 0, 200, { severidade: this.severidade || undefined, entidade: this.entidade || undefined, de: this.de || undefined, ate: this.ate || undefined })
      .subscribe(p => {
        const items = p.content || [];
        const counts: Record<string, number> = {};
        for (const r of items) {
          const key = `${r.regraCodigo || '—'} - ${r.severidade || ''}`;
          counts[key] = (counts[key] || 0) + 1;
        }
        this.topRejeicoes = Object.entries(counts).map(([chave, count]) => ({ chave, count })).sort((a,b) => b.count - a.count).slice(0, 10);
        this.loadingRej = false;
      }, _ => this.loadingRej = false);
  }
  gerar(tipo: string) {
    const params: any = {};
    if (this.execucaoId != null) params.execucaoId = this.execucaoId;
    if (this.severidade) params.severidade = this.severidade;
    if (this.entidade) params.entidade = this.entidade;
    if (this.de) params.de = this.de;
    if (this.ate) params.ate = this.ate;
    this.svc.create(tipo, params).subscribe((r: any) => { this.ultimoId = r?.idExport ?? r?.id; this.loadExecucoes(); });
  }
  baixar() {
    if (!this.ultimoId) return;
    this.svc.download(this.ultimoId).subscribe(resp => {
      const blob = resp.body as Blob;
      const cd = resp.headers.get('content-disposition') || '';
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd || '');
      let filename = 'export-ans';
      if (match) filename = decodeURIComponent(match[1] || match[2]);
      // fallback by MIME type
      if (!/\.\w+$/.test(filename)) {
        const type = blob?.type || '';
        filename += type.includes('xml') ? '.xml' : (type.includes('csv') ? '.csv' : '.bin');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  gerarSib() {
    if (!this.competencia) { alert('Informe a competencia (YYYY-MM)'); return; }
    // XML por padrao (formato oficial SIB-XML)
    this.sib.exportXml(this.competencia).subscribe((r: any) => { this.ultimoId = r?.idExport ?? r?.id; this.loadExecucoes(); });
  }

  detalhes(e: any) { this.expandedId = this.expandedId === e.id ? undefined : e.id; }
  baixarId(id?: number) { if (!id) return; this.ultimoId = id; this.baixar(); }
  compDe(e: any): string {
    try { const p = e?.parametros ? JSON.parse(e.parametros) : null; return p?.competencia || '—'; } catch { return '—'; }
  }
  execById(id?: number) { return this.execucoes.find(e => e.id === id); }
  paramsOf(obj: any): string {
    const p = obj?.parametros;
    if (!p) return '{}';
    if (typeof p === 'string') return p;
    try { return JSON.stringify(p, null, 2); } catch { return '{}'; }
  }

  onGridCellClicked(e: any) {
    const ds = (e?.event?.target as HTMLElement | null)?.dataset;
    const action = ds ? (ds['action'] as string | undefined) : undefined;
    if (!action) return;
    const row = e?.data;
    if (action === 'detalhes') { this.detalhes(row); }
    if (action === 'baixar') { this.baixarId(row?.id); }
  }
}
