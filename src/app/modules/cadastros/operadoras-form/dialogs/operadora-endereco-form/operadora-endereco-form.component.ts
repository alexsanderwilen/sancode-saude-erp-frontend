import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { BaseModalFormComponent } from '../../../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DominioTipo } from '../../../dominio-tipo/dominio-tipo.model';

@Component({
  selector: 'app-operadora-endereco-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseModalFormComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './operadora-endereco-form.component.html',
})
export class OperadoraEnderecoFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  dominioTipos: DominioTipo[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperadoraEnderecoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.id;
    this.dominioTipos = this.data?.dominioTipos || [];

    this.form = this.fb.group({
      id: [this.data?.id || null],
      tipo: [this.data?.tipo || '', Validators.required],
      cep: [this.data?.cep || '', Validators.required],
      logradouro: [this.data?.logradouro || '', Validators.required],
      numero: [this.data?.numero || '', Validators.required],
      complemento: [this.data?.complemento || ''],
      bairro: [this.data?.bairro || '', Validators.required],
      cidade: [this.data?.cidade || '', Validators.required],
      uf: [this.data?.uf || '', Validators.required],
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

  buscarCep(): void {
    // Implementar lógica de busca de CEP
  }
}

