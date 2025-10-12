import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { OperadoraTelefone } from '../../operadora.model';

@Component({
  selector: 'app-telefone-dialog',
  templateUrl: './telefone-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()]
})
export class TelefoneDialogComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TelefoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OperadoraTelefone
  ) {
    this.form = this.formBuilder.group({
      id: [data?.id],
      tipo: [data?.tipo || '', Validators.required],
      ddd: [data?.ddd || '', Validators.required],
      numero: [data?.numero || '', Validators.required],
      ramal: [data?.ramal || ''],
      whatsapp: [data?.whatsapp || false]
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
