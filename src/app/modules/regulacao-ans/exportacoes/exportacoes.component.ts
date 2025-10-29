import { Component } from '@angular/core';
// duplicate import removed
import { ExportsService } from '../services/exports.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ans-exportacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-3">
      <h2>Exportações ANS</h2>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" (click)="gerar('RELATORIO_INCONSISTENCIAS')">Relatório Inconsistências (CSV)</button>
        <button class="btn btn-outline-primary btn-sm" (click)="gerar('RELATORIO_INCONSISTENCIAS_ZIP')">Relatório (ZIP)</button>
      </div>
      <div class="row g-2 mt-3">
        <div class="col-auto"><label class="form-label">Execução</label><input class="form-control form-control-sm" [(ngModel)]="execucaoId" /></div>
        <div class="col-auto"><label class="form-label">Severidade</label>
          <select class="form-select form-select-sm" [(ngModel)]="severidade">
            <option value="">Todas</option><option>INFO</option><option>WARN</option><option>ERROR</option><option>BLOCK</option>
          </select></div>
        <div class="col-auto"><label class="form-label">Entidade</label>
          <select class="form-select form-select-sm" [(ngModel)]="entidade">
            <option value="">Todas</option><option>BENEFICIARIO</option><option>PLANO</option><option>OPERADORA</option><option>GUIA</option><option>LOTE</option>
          </select></div>
        <div class="col-auto"><label class="form-label">De (ISO)</label><input class="form-control form-control-sm" [(ngModel)]="de" placeholder="2025-10-01T00:00:00"/></div>
        <div class="col-auto"><label class="form-label">Até (ISO)</label><input class="form-control form-control-sm" [(ngModel)]="ate" placeholder="2025-10-31T23:59:59"/></div>
      </div>
      <div *ngIf="ultimoId">Último ID: {{ultimoId}} <button class="btn btn-link btn-sm" (click)="baixar()">baixar</button></div>
    </div>
  `
})
export class ExportacoesComponent {
  ultimoId?: number;
  execucaoId: number | null = null; severidade = ''; entidade = ''; de = ''; ate = '';
  constructor(private svc: ExportsService) {}
  gerar(tipo: string) {
    const params: any = {};
    if (this.execucaoId != null) params.execucaoId = this.execucaoId;
    if (this.severidade) params.severidade = this.severidade;
    if (this.entidade) params.entidade = this.entidade;
    if (this.de) params.de = this.de;
    if (this.ate) params.ate = this.ate;
    this.svc.create(tipo, params).subscribe((r: any) => this.ultimoId = r?.idExport ?? r?.id);
  }
  baixar() { if (!this.ultimoId) return; this.svc.download(this.ultimoId).subscribe(); }
}
