import { Component } from '@angular/core';
import { ExportsService } from '../services/exports.service';
import { SibService } from '../services/sib.service';
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
  competencia = '';
  constructor(private svc: ExportsService, private sib: SibService) {}
  gerar(tipo: string) {
    const params: any = {};
    if (this.execucaoId != null) params.execucaoId = this.execucaoId;
    if (this.severidade) params.severidade = this.severidade;
    if (this.entidade) params.entidade = this.entidade;
    if (this.de) params.de = this.de;
    if (this.ate) params.ate = this.ate;
    this.svc.create(tipo, params).subscribe((r: any) => this.ultimoId = r?.idExport ?? r?.id);
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
    if (!this.competencia) { alert('Informe a competência (YYYY-MM)'); return; }
    // XML por padrão (formato oficial SIB-XML)
    this.sib.exportXml(this.competencia).subscribe((r: any) => this.ultimoId = r?.idExport ?? r?.id);
  }
}

