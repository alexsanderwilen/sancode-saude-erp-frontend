import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-beneficiario-plano-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './beneficiario-plano-form.component.html',
  styleUrls: ['./beneficiario-plano-form.component.scss']
})
export class BeneficiarioPlanoFormComponent implements OnInit {
  form!: FormGroup;

  tiposVinculo = [
    { value: 'TITULAR', label: 'Titular' },
    { value: 'DEPENDENTE', label: 'Dependente' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BeneficiarioPlanoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const v = this.data || {};
    this.form = this.fb.group({
      id: [v.id],
      idPlano: [v.idPlano || null, Validators.required],
      numeroCarteirinha: [v.numeroCarteirinha || '', Validators.required],
      tipoVinculo: [v.tipoVinculo || 'TITULAR', Validators.required],
      idSituacao: [v.idSituacao || null, Validators.required],
      idParentesco: [v.idParentesco || null, Validators.required],
      idTitular: [v.idTitular || null],
      dataAdesao: [v.dataAdesao || null, Validators.required],
      dataInicioVigencia: [v.dataInicioVigencia || null, Validators.required],
      dataFimVigencia: [v.dataFimVigencia || null],
      emCarencia: [v.emCarencia ?? false],
      dataFimCarencia: [v.dataFimCarencia || null],
      valorMensalidade: [v.valorMensalidade || null],
      possuiCoparticipacao: [v.possuiCoparticipacao ?? false],
      percentualCoparticipacao: [v.percentualCoparticipacao || null],
      possuiDoencaPreexistente: [v.possuiDoencaPreexistente ?? false],
      descricaoDoencasPreexistentes: [v.descricaoDoencasPreexistentes || null],
      matriculaFuncionario: [v.matriculaFuncionario || null],
      cargo: [v.cargo || null],
      departamento: [v.departamento || null],
      dataAdmissao: [v.dataAdmissao || null],
      ativo: [v.ativo ?? true]
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

