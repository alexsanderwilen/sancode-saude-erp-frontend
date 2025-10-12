import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="params.value ? 'text-bg-success' : 'text-bg-danger'">
      {{ params.value ? 'Ativo' : 'Inativo' }}
    </span>
  `,
  styles: [`
    /* Removendo estilos customizados, pois usaremos classes Bootstrap */
  `]
})
export class StatusChipRenderer implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
