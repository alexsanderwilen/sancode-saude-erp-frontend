import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-ans-execucoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './execucoes-list.component.html',
  styleUrls: ['./execucoes-list.component.css']
})
export class ExecucoesListComponent {
  execucoes: any[] = [];
  constructor(private svc: ValidationsService) { this.load(); }
  load() { this.svc.executions(0, 20).subscribe(p => this.execucoes = p.content || []); }
  run() { this.svc.run().subscribe(() => this.load()); }
}

