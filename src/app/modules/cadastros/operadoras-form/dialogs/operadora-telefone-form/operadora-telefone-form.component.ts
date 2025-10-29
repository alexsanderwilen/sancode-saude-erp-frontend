import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { BaseModalFormComponent } from '../../../../../shared/components/base-modal-form/base-modal-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DominioTipo } from '../../../dominio-tipo/dominio-tipo.model';
import { DominioTipoService } from '../../../dominio-tipo/dominio-tipo.service';

@Component({
  selector: 'app-operadora-telefone-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseModalFormComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './operadora-telefone-form.component.html',
})
export class OperadoraTelefoneFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean = false;
  dominioTipos: DominioTipo[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperadoraTelefoneFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dominioTipoService: DominioTipoService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.id;
    this.dominioTipos = this.data?.dominioTipos || [];

    this.form = this.fb.group({
      id: [this.data?.id || null],
      tipo: [this.data?.tipo || '', Validators.required],
      ddd: [this.data?.ddd || '', Validators.required],
      numero: [this.data?.numero || '', Validators.required],
      ramal: [this.data?.ramal || ''],
      whatsapp: [this.data?.whatsapp || false]
    });
  }

  refreshTipos(): void {
    this.dominioTipoService.findAll().subscribe(all => {
      this.dominioTipos = (all as DominioTipo[]).filter(dt => dt.tipoDoTipo === 'TELEFONE' && dt.status);
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

