import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OperadoraEmail } from '../../operadora.model';
import { MatSelectModule } from '@angular/material/select';
import { DominioTipo } from '../../dominio-tipo/dominio-tipo.model';

interface EmailDialogData {
  id?: string;
  tipo: string;
  email: string;
  dominioTipos: DominioTipo[];
}

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class EmailDialogComponent {
  form: FormGroup;
  dominioTipos: DominioTipo[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailDialogData
  ) {
    this.dominioTipos = data.dominioTipos;
    this.form = this.formBuilder.group({
      id: [data?.id],
      tipo: [data?.tipo || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

