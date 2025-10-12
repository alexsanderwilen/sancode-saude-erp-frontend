import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-chip" [ngClass]="params.value ? 'active' : 'inactive'">
      {{ params.value ? 'Sim' : 'Não' }}
    </span>
  `,
  styles: [`
    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      color: #fff;
    }

    .status-chip.active {
      background-color: #4caf50; /* Green */
    }

    .status-chip.inactive {
      background-color: #f44336; /* Red */
    }
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
