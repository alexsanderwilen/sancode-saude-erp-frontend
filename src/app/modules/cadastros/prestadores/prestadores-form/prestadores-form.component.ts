import { Component, OnInit, OnDestroy } from '@angular/core';
﻿import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
﻿import { ActivatedRoute, Router, RouterModule } from '@angular/router';
﻿import { PrestadorService } from '../prestador.service';
﻿import { Prestador } from '../prestador.model';
﻿import { CommonModule } from '@angular/common';
﻿import { MatCardModule } from '@angular/material/card';
﻿import { MatFormFieldModule } from '@angular/material/form-field';
﻿import { MatInputModule } from '@angular/material/input';
﻿import { MatSelectModule } from '@angular/material/select';
﻿import { MatButtonModule } from '@angular/material/button';
﻿import { MatCheckboxModule } from '@angular/material/checkbox';
﻿import { MatTabsModule } from '@angular/material/tabs';
﻿import { Subscription } from 'rxjs';
﻿import { OperadoraService } from '../../operadora.service'; // Importar OperadoraService
﻿import { Operadora } from '../../operadora.model'; // Importar Operadora
﻿
﻿@Component({
﻿  selector: 'app-prestadores-form',
﻿  templateUrl: './prestadores-form.component.html',
﻿  styleUrls: ['./prestadores-form.component.scss'],
﻿  standalone: true,
﻿  imports: [
﻿    CommonModule,
﻿    ReactiveFormsModule,
﻿    RouterModule,
﻿    MatCardModule,
﻿    MatFormFieldModule,
﻿    MatInputModule,
﻿    MatSelectModule,
﻿    MatButtonModule,
﻿    MatCheckboxModule,
﻿    MatTabsModule
﻿  ]
﻿})
﻿export class PrestadoresFormComponent implements OnInit, OnDestroy {
﻿
﻿  prestadorForm: FormGroup;
﻿  isEditMode = false;
﻿  prestadorId: number | null = null;
﻿  private formStatusSubscription: Subscription | undefined;
﻿  operadoras: Operadora[] = []; // Propriedade para armazenar as operadoras
﻿
﻿  constructor(
﻿    private fb: FormBuilder,
﻿    private prestadorService: PrestadorService,
﻿    private router: Router,
﻿    private route: ActivatedRoute,
﻿    private operadoraService: OperadoraService // Injetar OperadoraService
﻿  ) {
﻿    this.prestadorForm = this.fb.group({
﻿      id: [null],
﻿      tipoPessoa: ['J', Validators.required],
﻿      cpfCnpj: ['', Validators.required],
﻿      nomeRazaoSocial: ['', Validators.required],
﻿      nomeFantasia: [''],
﻿      cnes: [''],
﻿      situacaoCadastral: ['Ativo', Validators.required],
﻿      tipoPrestador: ['', Validators.required],
﻿      registroConselho: [''],
﻿      tipoConselho: [''],
﻿      ufConselho: [''],
﻿      especialidadePrincipal: [''],
﻿      especialidadesSecundarias: [''],
﻿      email: ['', [Validators.email]],
﻿      telefone: [''],
﻿      celular: [''],
﻿      site: [''],
﻿      cep: [''],
﻿      logradouro: [''],
﻿      numero: [''],
﻿      complemento: [''],
﻿      bairro: [''],
﻿      cidade: [''],
﻿      uf: [''],
﻿      atendeUrgencia: [false],
﻿      atendeDomiciliar: [false],
﻿      observacoes: [''],
﻿      idOperadora: ['', Validators.required]
﻿    });
﻿  }
﻿
﻿  ngOnInit(): void {
﻿    this.loadOperadoras(); // Carregar operadoras ao inicializar o componente
﻿
﻿    this.prestadorId = this.route.snapshot.params['id'];
﻿    if (this.prestadorId) {
﻿      this.isEditMode = true;
﻿      this.prestadorService.getPrestador(this.prestadorId).subscribe(prestador => {
﻿        this.prestadorForm.patchValue(prestador);
﻿      });
﻿    }
﻿
﻿    this.formStatusSubscription = this.prestadorForm.valueChanges.subscribe(() => {
﻿      this.logFormValidation();
﻿    });
﻿    this.logFormValidation();
﻿  }
﻿
﻿  ngOnDestroy(): void {
﻿    if (this.formStatusSubscription) {
﻿      this.formStatusSubscription.unsubscribe();
﻿    }
﻿  }
﻿
﻿  loadOperadoras(): void {
﻿    this.operadoraService.getOperadoras(0, 1000, 'razaoSocial', 'asc').subscribe(
﻿      page => {
﻿        this.operadoras = page.content;
﻿      },
﻿      error => {
﻿        console.error('Erro ao carregar operadoras:', error);
﻿      }
﻿    );
﻿  }
﻿
﻿  logFormValidation(): void {
﻿    console.log('--- Validação do Formulário Prestador ---');
﻿    console.log('Formulário Válido:', this.prestadorForm.valid);
﻿    console.log('Formulário Tocado:', this.prestadorForm.touched);
﻿    console.log('Formulário Sujo:', this.prestadorForm.dirty);
﻿
﻿    Object.keys(this.prestadorForm.controls).forEach(key => {
﻿      const control = this.prestadorForm.get(key);
﻿      if (control) {
﻿        console.log(`Campo: ${key}, Válido: ${control.valid}, Erros:`, control.errors);
﻿      }
﻿    });
﻿    console.log('---------------------------------------');
﻿  }
﻿
﻿  onSubmit(): void {
﻿    if (this.prestadorForm.valid) {
﻿      const prestador: Prestador = this.prestadorForm.value;
﻿      if (this.isEditMode && this.prestadorId) {
﻿        this.prestadorService.updatePrestador(this.prestadorId, prestador).subscribe(() => {
﻿          this.router.navigate(['/cadastros/prestadores']);
﻿        });
﻿      } else {
﻿        this.prestadorService.createPrestador(prestador).subscribe(() => {
﻿          this.router.navigate(['/cadastros/prestadores']);
﻿        });
﻿      }
﻿    } else {
﻿      this.logFormValidation();
﻿    }
﻿  }
﻿}
