import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-regulacao-ans-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
  <h3>Regulação e Compliance ANS</h3>
  <div class="row g-3">
    <div class="col-md-3" *ngFor="let link of links">
      <mat-card class="p-3">
        <div class="mb-2"><strong>{{ link.title }}</strong></div>
        <button mat-stroked-button color="primary" [routerLink]="link.path">Abrir</button>
      </mat-card>
    </div>
  </div>
  `
})
export class RegulacaoAnsHomeComponent {
  links = [
    { title: 'Dashboard', path: 'dashboard' },
    { title: 'Execuções de Validação', path: 'validacoes/execucoes' },
    { title: 'Resultados de Validação', path: 'validacoes/resultados' },
    { title: 'Regras', path: 'validacoes/regras' },
    { title: 'Exportações', path: 'exportacoes' },
    { title: 'TISS', path: 'tiss' }
  ];
}

