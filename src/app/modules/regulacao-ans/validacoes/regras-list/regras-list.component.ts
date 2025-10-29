import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-ans-regras',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-3">
      <h2>Regras ANS</h2>
      <ul class="mt-2">
        <li *ngFor="let r of regras">{{r.codigo}} - {{r.titulo}} ({{r.severidade}} / {{r.escopo}})</li>
      </ul>
    </div>
  `
})
export class RegrasListComponent {
  regras: any[] = [];
  constructor(private svc: ValidationsService) { this.svc.rules().subscribe(r => this.regras = r); }
}
