import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-ans-execucoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-3">
      <h2>Execuções de Validação</h2>
      <button (click)="run()" class="btn btn-primary btn-sm">Executar Validação</button>
      <ul class="mt-3">
        <li *ngFor="let e of execucoes">#{{e.id}} - {{e.status}} - {{e.iniciadoEm}}</li>
      </ul>
    </div>
  `
})
export class ExecucoesListComponent {
  execucoes: any[] = [];
  constructor(private svc: ValidationsService) { this.load(); }
  load() { this.svc.executions(0, 20).subscribe(p => this.execucoes = p.content || []); }
  run() { this.svc.run().subscribe(() => this.load()); }
}
