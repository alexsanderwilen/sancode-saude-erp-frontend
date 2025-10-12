import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { OperadoraService } from '../operadora.service';
import { Operadora, OperadoraEndereco, OperadoraTelefone, OperadoraEmail } from '../operadora.model';

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
    NgxMaskDirective,
    MatIconModule,
    MatTabsModule,
    MatCardModule
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
      ativo: [true],
      enderecos: this.formBuilder.array([]), // FormArray para endereços
      telefones: this.formBuilder.array([]), // FormArray para telefones
      emails: this.formBuilder.array([]) // FormArray para e-mails
    });
  }

  ngOnInit(): void {
    this.operadoraId = this.route.snapshot.params['id'];
    if (this.operadoraId) {
      this.isEditMode = true;
      this.operadoraService.getById(this.operadoraId).subscribe(operadora => {
        this.form.patchValue(operadora);
        // Popular FormArray de endereços
        operadora.enderecos.forEach(endereco => this.enderecos.push(this.createEnderecoFormGroup(endereco)));
        // Popular FormArray de telefones
        operadora.telefones.forEach(telefone => this.telefones.push(this.createTelefoneFormGroup(telefone)));
        // Popular FormArray de e-mails
        operadora.emails.forEach(email => this.emails.push(this.createEmailFormGroup(email)));
      });
    } else {
      // Adicionar um item vazio por padrão para novos cadastros
      this.addEndereco();
      this.addTelefone();
      this.addEmail();
    }
  }

  // Getters para os FormArray
  get enderecos(): FormArray {
    return this.form.get('enderecos') as FormArray;
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  // Métodos para criar FormGroup para cada tipo de item
  createEnderecoFormGroup(endereco?: OperadoraEndereco): FormGroup {
    return this.formBuilder.group({
      id: [endereco?.id],
      tipo: [endereco?.tipo || '', Validators.required],
      cep: [endereco?.cep || '', Validators.required],
      logradouro: [endereco?.logradouro || '', Validators.required],
      numero: [endereco?.numero || '', Validators.required],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || '', Validators.required],
      cidade: [endereco?.cidade || '', Validators.required],
      uf: [endereco?.uf || '', Validators.required],
      pais: [endereco?.pais || 'BRASIL', Validators.required],
      latitude: [endereco?.latitude],
      longitude: [endereco?.longitude]
    });
  }

  createTelefoneFormGroup(telefone?: OperadoraTelefone): FormGroup {
    return this.formBuilder.group({
      id: [telefone?.id],
      tipo: [telefone?.tipo || '', Validators.required],
      ddd: [telefone?.ddd || '', Validators.required],
      numero: [telefone?.numero || '', Validators.required],
      ramal: [telefone?.ramal || ''],
      whatsapp: [telefone?.whatsapp || false]
    });
  }

  createEmailFormGroup(email?: OperadoraEmail): FormGroup {
    return this.formBuilder.group({
      id: [email?.id],
      tipo: [email?.tipo || '', Validators.required],
      email: [email?.email || '', [Validators.required, Validators.email]]
    });
  }

  // Métodos para adicionar itens
  addEndereco(): void {
    this.enderecos.push(this.createEnderecoFormGroup());
  }

  addTelefone(): void {
    this.telefones.push(this.createTelefoneFormGroup());
  }

  addEmail(): void {
    this.emails.push(this.createEmailFormGroup());
  }

  // Métodos para remover itens
  removeEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  save(): void {
    if (this.form.invalid) {
      this.snackBar.open('Formulário inválido! Verifique todos os campos.', 'Fechar', { duration: 3000 });
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
      error: (err) => {
        console.error('Erro ao salvar operadora:', err);
        this.snackBar.open('Erro ao salvar operadora. Detalhes: ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cadastros/operadoras']);
  }
}
