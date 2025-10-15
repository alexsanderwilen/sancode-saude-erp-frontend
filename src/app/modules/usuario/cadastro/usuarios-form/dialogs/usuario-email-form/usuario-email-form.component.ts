import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DominioTipo } from '../../../../../cadastros/dominio-tipo/dominio-tipo.model';
import { BaseModalFormComponent } from '../../../../../../shared/components/base-modal-form/base-modal-form.component';

@Component({
  selector: 'app-usuario-email-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    BaseModalFormComponent
  ],
  templateUrl: './usuario-email-form.component.html',
  styleUrls: ['./usuario-email-form.component.scss']
})
export class UsuarioEmailFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsuarioEmailFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo: [this.data?.tipo || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
