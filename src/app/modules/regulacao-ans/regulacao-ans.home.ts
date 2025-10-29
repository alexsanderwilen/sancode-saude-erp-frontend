import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-regulacao-ans-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './regulacao-ans.home.html',
  styleUrls: ['./regulacao-ans.home.css']
})
export class RegulacaoAnsHomeComponent {
  links = [
    { title: 'Dashboard', path: 'dashboard' },
    { title: 'Execu����es de Valida��ǜo', path: 'validacoes/execucoes' },
    { title: 'Resultados de Valida��ǜo', path: 'validacoes/resultados' },
    { title: 'Regras', path: 'validacoes/regras' },
    { title: 'Exporta����es', path: 'exportacoes' },
    { title: 'TISS', path: 'tiss' }
  ];
}

