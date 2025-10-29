import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationsService } from '../../../services/validations.service';

@Component({
  selector: 'app-ans-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-3">
      <h2>Resultados de Validação</h2>
      <label>Execução ID: <input [(ngModel)]="execucaoId" /></label>
      <button (click)="load()" class="btn btn-outline-secondary btn-sm">Carregar</button>
      <ul class="mt-3">
        <li *ngFor="let r of resultados">{{r.regraCodigo}} - {{r.severidade}} - {{r.mensagem}}</li>
      </ul>
    </div>
  `
})
export class ResultadosListComponent {
  execucaoId = 1;
  resultados: any[] = [];
  constructor(private svc: ValidationsService) {}
  load() { this.svc.results(this.execucaoId, 0, 20).subscribe(p => this.resultados = p.content || []); }
}
