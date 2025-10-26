import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrestadorService } from '../prestador.service';
import { Prestador } from '../prestador.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-prestadores-form',
  templateUrl: './prestadores-form.component.html',
  styleUrls: ['./prestadores-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCheckboxModule,
    MatTabsModule
  ]
})
export class PrestadoresFormComponent implements OnInit {

  prestadorForm: FormGroup;
  isEditMode = false;
  prestadorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private prestadorService: PrestadorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.prestadorForm = this.fb.group({
      id: [null],
      tipoPessoa: ['J', Validators.required],
      cpfCnpj: ['', Validators.required],
      nomeRazaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      cnes: [''],
      situacaoCadastral: ['Ativo', Validators.required],
      tipoPrestador: ['', Validators.required],
      registroConselho: [''],
      tipoConselho: [''],
      ufConselho: [''],
      especialidadePrincipal: [''],
      especialidadesSecundarias: [''],
      email: ['', [Validators.email]],
      telefone: [''],
      celular: [''],
      site: [''],
      cep: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
      atendeUrgencia: [false],
      atendeDomiciliar: [false],
      observacoes: [''],
      idOperadora: [1, Validators.required] // Hardcoded for now
    });
  }

  ngOnInit(): void {
    this.prestadorId = this.route.snapshot.params['id'];
    if (this.prestadorId) {
      this.isEditMode = true;
      this.prestadorService.getPrestador(this.prestadorId).subscribe(prestador => {
        this.prestadorForm.patchValue(prestador);
      });
    }
  }

  onSubmit(): void {
    if (this.prestadorForm.valid) {
      const prestador: Prestador = this.prestadorForm.value;
      if (this.isEditMode && this.prestadorId) {
        this.prestadorService.updatePrestador(this.prestadorId, prestador).subscribe(() => {
          this.router.navigate(['/cadastros/prestadores']);
        });
      } else {
        this.prestadorService.createPrestador(prestador).subscribe(() => {
          this.router.navigate(['/cadastros/prestadores']);
        });
      }
    }
  }
}

