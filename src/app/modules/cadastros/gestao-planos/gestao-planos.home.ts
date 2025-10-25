import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-gestao-planos-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
  <h3>Gestão de Planos</h3>
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
export class GestaoPlanosHomeComponent {
  links = [
    { title: 'Planos Base', path: 'planos-base' },
    { title: 'Segmentações Assistenciais', path: 'segmentacoes' },
    { title: 'Abrangências Geográficas', path: 'abrangencias' },
    { title: 'Tipos de Contratação', path: 'tipos-contratacao' },
    { title: 'Status de Plano', path: 'planos-status' },
    { title: 'Tipos de Pagamento', path: 'tipos-pagamento' },
    { title: 'Acomodações', path: 'acomodacoes' },
    { title: 'Coberturas Adicionais', path: 'coberturas-adicionais' }
  ];
}

