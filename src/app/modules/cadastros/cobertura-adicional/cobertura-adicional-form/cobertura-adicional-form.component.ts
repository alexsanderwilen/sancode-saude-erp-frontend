import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseModalFormComponent } from '../../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-cobertura-adicional-form',
  standalone: true,
  imports: [CommonModule, BaseModalFormComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  templateUrl: './cobertura-adicional-form.component.html',
  styleUrls: ['./cobertura-adicional-form.component.scss']
})
export class CoberturaAdicionalFormComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, title: string }, private ref: MatDialogRef<CoberturaAdicionalFormComponent>) {}
  onSave(): void { this.ref.close({ saved: true }); }
  onCancel(): void { this.ref.close(); }
}

