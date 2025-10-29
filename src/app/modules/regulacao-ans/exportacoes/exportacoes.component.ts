import { Component, OnInit } from '@angular/core';
import { ExportsService } from '../services/exports.service';
import { SibService } from '../services/sib.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../services/validations.service';

@Component({
  selector: 'app-ans-exportacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private svc: ExportsService, private sib: SibService, private validations: ValidationsService) {}

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
}
