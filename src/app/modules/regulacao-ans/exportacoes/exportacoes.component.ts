import { Component } from '@angular/core';
import { ExportsService } from '../services/exports.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ans-exportacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exportacoes.component.html',
  styleUrls: ['./exportacoes.component.css']
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

