import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DominioTipo } from '../../../../../cadastros/dominio-tipo/dominio-tipo.model';
import { BaseModalFormComponent } from '../../../../../../shared/components/base-modal-form/base-modal-form.component';

@Component({
  selector: 'app-usuario-telefone-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxMaskDirective,
    BaseModalFormComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './usuario-telefone-form.component.html',
  styleUrls: ['./usuario-telefone-form.component.scss']
})
export class UsuarioTelefoneFormComponent implements OnInit {
  form!: FormGroup;
  dominioTipos: DominioTipo[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsuarioTelefoneFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.dominioTipos = this.data?.dominioTipos || [];
    this.form = this.fb.group({
      tipo: [this.data?.tipo || '', Validators.required],
      ddd: [this.data?.ddd || '', Validators.required],
      numero: [this.data?.numero || '', Validators.required],
      ramal: [this.data?.ramal || ''],
      whatsapp: [this.data?.whatsapp || false]
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
