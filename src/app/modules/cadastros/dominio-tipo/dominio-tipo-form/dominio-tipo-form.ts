import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DominioTipoService } from '../dominio-tipo.service';
import { DominioTipo } from '../dominio-tipo.model';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseModalFormComponent } from '../../../../shared/components/base-modal-form/base-modal-form.component';

@Component({
  selector: 'app-dominio-tipo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    BaseModalFormComponent
  ],
  templateUrl: './dominio-tipo-form.html',
  styleUrl: './dominio-tipo-form.scss',
})
export class DominioTipoFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<DominioTipoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DominioTipo
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
    if (this.isEditMode) {
      this.form.patchValue(this.data);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [this.data?.id || null],
      tipoDoTipo: [this.data?.tipoDoTipo || '', Validators.required],
      descricao: [this.data?.descricao || '', Validators.required],
      status: [this.data ? this.data.status : true],
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

