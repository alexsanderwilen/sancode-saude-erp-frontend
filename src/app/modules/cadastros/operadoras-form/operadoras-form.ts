import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { OperadoraService } from '../operadora.service';
import { Operadora } from '../operadora.model';

@Component({
  selector: 'app-operadoras-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatCheckboxModule,
    NgxMaskDirective
  ],
  providers: [provideNativeDateAdapter(), provideNgxMask()],
  templateUrl: './operadoras-form.html',
  styleUrl: './operadoras-form.scss'
})
export class OperadorasFormComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly operadoraService = inject(OperadoraService);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEditMode = false;
  private operadoraId?: string;

  constructor() {
    this.form = this.formBuilder.group({
      registroAns: ['', [Validators.required, Validators.maxLength(6)]],
      cnpj: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required, Validators.maxLength(255)]],
      nomeFantasia: [''],
      dataRegistroAns: [null],
      emailCorporativo: ['', [Validators.email]],
      telefonePrincipal: [''],
      cep: [''],
      uf: [''],
      cidade: [''],
      bairro: [''],
      enderecoLogradouro: [''],
      enderecoNumero: [''],
      enderecoComplemento: [''],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.operadoraId = this.route.snapshot.params['id'];
    if (this.operadoraId) {
      this.isEditMode = true;
      this.operadoraService.getById(this.operadoraId).subscribe(operadora => {
        this.form.patchValue(operadora);
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.snackBar.open('Formulário inválido!', 'Fechar', { duration: 3000 });
      return;
    }

    const operadora: Operadora = this.form.value;
    const request = this.isEditMode
      ? this.operadoraService.update(this.operadoraId!, operadora)
      : this.operadoraService.create(operadora);

    request.subscribe({
      next: () => {
        this.snackBar.open('Operadora salva com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/cadastros/operadoras']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar operadora.', 'Fechar', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cadastros/operadoras']);
  }
}
