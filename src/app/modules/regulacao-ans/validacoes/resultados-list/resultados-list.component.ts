import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-ans-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados-list.component.html',
  styleUrls: ['./resultados-list.component.css']
})
export class ResultadosListComponent {
  execucaoId = 1;
  resultados: any[] = [];
  constructor(private svc: ValidationsService) {}
  load() { this.svc.results(this.execucaoId, 0, 20).subscribe(p => this.resultados = p.content || []); }
}

