import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

type ModuleTheme = 'cadastros' | 'financeiro' | 'relatorios';

@Component({
  selector: 'app-base-modal-form',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './base-modal-form.component.html',
  styleUrls: ['./base-modal-form.component.scss']
})
export class BaseModalFormComponent {
  @Input() title: string = 'Formulário';
  @Input() moduleTheme: ModuleTheme = 'cadastros';

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getThemeClass(): string {
    return this.moduleTheme ? `sancode-${this.moduleTheme}-theme` : '';
  }

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

