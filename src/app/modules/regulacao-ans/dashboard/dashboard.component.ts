import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-ans-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-3">
      <h2>Dashboard de Compliance ANS</h2>
      <div *ngIf="data as d; else loading">
        <div>Taxa de Aceitação: {{ d.taxaAceitacao | number:'1.0-3' }}</div>
        <div>Pendências Totais: {{ d.pendenciasTotais }}</div>
        <div>Tempo Médio (min): {{ d.tempoMedioProcessamentoMin }}</div>
      </div>
      <ng-template #loading>Carregando...</ng-template>
    </div>
  `
})
export class DashboardComponent {
  data: any;
  constructor(private svc: DashboardService) { this.svc.metrics().subscribe(d => this.data = d); }
}
