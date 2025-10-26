import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { OperadoraEndereco } from '../../operadora.model';
import { MatSelectModule } from '@angular/material/select';
import { DominioTipo } from '../../dominio-tipo/dominio-tipo.model';

interface EnderecoDialogData {
  id?: string;
  tipo: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  latitude?: number;
  longitude?: number;
  dominioTipos: DominioTipo[];
}

@Component({
  selector: 'app-endereco-dialog',
  templateUrl: './endereco-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective,
    MatSelectModule
  ],
  providers: [provideNgxMask()]
})
export class EnderecoDialogComponent {
  form: FormGroup;
  dominioTipos: DominioTipo[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EnderecoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EnderecoDialogData
  ) {
    this.dominioTipos = data.dominioTipos;
    this.form = this.formBuilder.group({
      id: [data?.id],
      tipo: [data?.tipo || '', Validators.required],
      cep: [data?.cep || '', Validators.required],
      logradouro: [data?.logradouro || '', Validators.required],
      numero: [data?.numero || '', Validators.required],
      complemento: [data?.complemento || ''],
      bairro: [data?.bairro || '', Validators.required],
      cidade: [data?.cidade || '', Validators.required],
      uf: [data?.uf || '', Validators.required],
      pais: [data?.pais || 'BRASIL', Validators.required],
      latitude: [data?.latitude],
      longitude: [data?.longitude]
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

