import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DominioTipoService } from '../dominio-tipo.service';
import { DominioTipo } from '../dominio-tipo.model';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
  ],
  templateUrl: './dominio-tipo-form.html',
  styleUrl: './dominio-tipo-form.scss',
})
export class DominioTipoFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  dominioTipoId: number | null = null;

  private fb = inject(FormBuilder);
  private dominioTipoService = inject(DominioTipoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.dominioTipoId = +id;
        this.isEditMode = true;
        this.loadDominioTipo(this.dominioTipoId);
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      tipoDoTipo: ['', Validators.required],
      descricao: ['', Validators.required],
      status: [true],
    });
  }

  loadDominioTipo(id: number): void {
    this.dominioTipoService.findById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
      },
      error: (error) => {
        console.error('Erro ao carregar tipo de domínio:', error);
        this.snackBar.open('Erro ao carregar tipo de domínio.', 'Fechar', { duration: 3000 });
      },
    });
  }

  save(): void {
    if (this.form.valid) {
      const dominioTipo: DominioTipo = this.form.value;
      if (this.isEditMode) {
        this.dominioTipoService.update(this.dominioTipoId!, dominioTipo).subscribe({
          next: () => {
            this.snackBar.open('Tipo de domínio atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/cadastros/dominio-tipos']);
          },
          error: (error) => {
            console.error('Erro ao atualizar tipo de domínio:', error);
            this.snackBar.open('Erro ao atualizar tipo de domínio.', 'Fechar', { duration: 3000 });
          },
        });
      } else {
        this.dominioTipoService.create(dominioTipo).subscribe({
          next: () => {
            this.snackBar.open('Tipo de domínio criado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/cadastros/dominio-tipos']);
          },
          error: (error) => {
            console.error('Erro ao criar tipo de domínio:', error);
            this.snackBar.open('Erro ao criar tipo de domínio.', 'Fechar', { duration: 3000 });
          },
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/cadastros/dominio-tipos']);
  }
}
